import { db } from "@/lib/db";
import { countChineseChars } from "@/lib/text-count";
import { createChatCompletionStream, createChatCompletionText, LlmConfigError } from "@/lib/llm/adapter";
import {
  buildChapterPlanPrompt,
  buildChapterPrompt,
  buildContinuityPrompt,
  chapterPlanSystemPrompt,
  chapterSystemPrompt,
  continuitySystemPrompt
} from "@/lib/llm/prompts";
import { parseModelJson } from "@/lib/json-repair";
import { sendSse, streamHeaders } from "@/lib/sse";
import { assertSafeNovelInput } from "@/lib/safety";
import { archiveProjectToGitHub } from "@/lib/github-archive";

export const runtime = "nodejs";

type ChapterPlan = {
  chapters: Array<{
    index: number;
    title: string;
    targetChars: number;
    function?: string;
    mainEvents?: string[];
    emotionProgress?: string;
    foreshadowing?: string[];
    endingHook?: string;
  }>;
};

type GenerateOptions = {
  archiveToGitHub?: unknown;
};

function parseSkillIds(raw: string) {
  try {
    return JSON.parse(raw || "[]") as string[];
  } catch {
    return [];
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const options = (await request.json().catch(() => ({}))) as GenerateOptions;
  const shouldArchiveToGitHub = options.archiveToGitHub === true;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      void (async () => {
        try {
          const project = await db.project.findUnique({
            where: { id: params.id },
            include: { chapters: { orderBy: { index: "asc" } } }
          });
          if (!project) throw new Error("项目不存在");
          if (!project.editedOutline) throw new Error("请先生成并保存大纲");
          assertSafeNovelInput(`${project.sourceText}\n${project.uploadedDocText || ""}\n${project.editedOutline}`);

          const selectedSkillIds = parseSkillIds(project.selectedSkillIds);
          sendSse(controller, "meta", { projectId: project.id });

          await db.project.update({
            where: { id: project.id },
            data: { status: "GENERATING", totalGeneratedChars: 0, continuityBible: project.continuityBible || "" }
          });
          await db.chapter.deleteMany({ where: { projectId: project.id } });

          const rawPlan = await createChatCompletionText({
            model: project.modelId,
            temperature: 0.4,
            messages: [
              { role: "system", content: chapterPlanSystemPrompt },
              {
                role: "user",
                content: buildChapterPlanPrompt({
                  editedOutline: project.editedOutline,
                  targetWordCount: project.targetWordCount,
                  chapterWordCount: project.chapterWordCount,
                  selectedSkillIds
                })
              }
            ]
          });
          const chapterPlan = parseModelJson<ChapterPlan>(rawPlan);

          let totalGeneratedChars = 0;
          let continuityBible = project.continuityBible || "";
          let previousChapterSummary = "";

          for (const plan of chapterPlan.chapters) {
            const chapterTitle = plan.title || `第 ${plan.index} 章`;
            const targetChars = Number(plan.targetChars || project.chapterWordCount);
            let content = "";
            sendSse(controller, "chapter_start", { index: plan.index, title: chapterTitle });

            for await (const chunk of createChatCompletionStream({
              model: project.modelId,
              temperature: 0.82,
              messages: [
                { role: "system", content: chapterSystemPrompt },
                {
                  role: "user",
                  content: buildChapterPrompt({
                    title: project.title,
                    editedOutline: project.editedOutline,
                    chapterPlan: plan,
                    targetChars,
                    continuityBible,
                    previousChapterSummary,
                    selectedSkillIds
                  })
                }
              ]
            })) {
              content += chunk;
              const chapterChars = countChineseChars(content);
              sendSse(controller, "delta", { text: chunk });
              sendSse(controller, "progress", {
                generatedChars: totalGeneratedChars + chapterChars,
                targetWordCount: project.targetWordCount,
                percent: Math.min(100, Math.round(((totalGeneratedChars + chapterChars) / project.targetWordCount) * 1000) / 10)
              });
            }

            const summary = await createChatCompletionText({
              model: project.modelId,
              temperature: 0.35,
              maxTokens: 1800,
              messages: [
                { role: "system", content: continuitySystemPrompt },
                { role: "user", content: buildContinuityPrompt({ oldContinuityBible: continuityBible, chapterTitle, chapterContent: content }) }
              ]
            });

            totalGeneratedChars += countChineseChars(content);
            continuityBible = summary;
            previousChapterSummary = summary.slice(0, 1200);

            await db.chapter.create({
              data: {
                projectId: project.id,
                index: plan.index,
                title: chapterTitle,
                targetChars,
                content,
                summary,
                status: "DONE"
              }
            });
            await db.project.update({
              where: { id: project.id },
              data: { totalGeneratedChars, continuityBible }
            });

            sendSse(controller, "chapter_done", { index: plan.index, summary });
          }

          await db.project.update({
            where: { id: project.id },
            data: { status: "GENERATED", totalGeneratedChars, continuityBible }
          });
          const setting = await db.appSetting.findUnique({ where: { id: "singleton" } });
          if (!setting) {
            await db.appSetting.create({
              data: {
                id: "singleton",
                recipientName: process.env.RECIPIENT_NAME || "王悦然",
                confessionTitle: "给王悦然的一封信",
                firstProjectId: project.id
              }
            });
          } else if (!setting.firstProjectId) {
            await db.appSetting.update({ where: { id: "singleton" }, data: { firstProjectId: project.id } });
          }
          if (shouldArchiveToGitHub) {
            sendSse(controller, "archive_start", {});
            await archiveProjectToGitHub(project.id)
              .then((result) => sendSse(controller, "archive_done", result))
              .catch((error) => {
                console.error("GitHub novel archive failed", error);
                sendSse(controller, "archive_error", { message: error instanceof Error ? error.message : "GitHub 归档失败" });
              });
          } else {
            sendSse(controller, "archive_skipped", {});
          }
          sendSse(controller, "done", { projectId: project.id });
        } catch (error) {
          await db.project.update({ where: { id: params.id }, data: { status: "FAILED" } }).catch(() => undefined);
          const message = error instanceof LlmConfigError ? error.message : error instanceof Error ? error.message : "小说生成失败";
          sendSse(controller, "error", { message });
        } finally {
          controller.close();
        }
      })();
    }
  });

  return new Response(stream, { headers: streamHeaders() });
}
