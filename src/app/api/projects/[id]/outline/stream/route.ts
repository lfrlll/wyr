import { db } from "@/lib/db";
import { createChatCompletionStream, LlmConfigError } from "@/lib/llm/adapter";
import { buildOutlineUserPrompt, outlineSystemPrompt } from "@/lib/llm/prompts";
import { sendSse, streamHeaders } from "@/lib/sse";
import { assertSafeNovelInput } from "@/lib/safety";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      void (async () => {
        let full = "";
        try {
          const project = await db.project.findUnique({ where: { id: params.id } });
          if (!project) throw new Error("项目不存在");
          assertSafeNovelInput(`${project.sourceText}\n${project.uploadedDocText || ""}`);
          sendSse(controller, "meta", { projectId: project.id });

          for await (const chunk of createChatCompletionStream({
            model: project.modelId,
            temperature: 0.72,
            messages: [
              { role: "system", content: outlineSystemPrompt },
              {
                role: "user",
                content: buildOutlineUserPrompt({
                  title: project.title,
                  sourceText: project.sourceText,
                  uploadedDocText: project.uploadedDocText
                })
              }
            ]
          })) {
            full += chunk;
            sendSse(controller, "delta", { text: chunk });
          }

          await db.project.update({
            where: { id: project.id },
            data: { outline: full, editedOutline: full, status: "OUTLINE_READY" }
          });
          sendSse(controller, "done", { projectId: project.id });
        } catch (error) {
          const message = error instanceof LlmConfigError ? error.message : error instanceof Error ? error.message : "大纲生成失败";
          sendSse(controller, "error", { message });
        } finally {
          controller.close();
        }
      })();
    }
  });

  return new Response(stream, { headers: streamHeaders() });
}
