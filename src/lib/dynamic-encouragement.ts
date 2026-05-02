import { db } from "@/lib/db";
import { cleanEncouragementMessage, getRandomEncouragement } from "@/lib/encouragement";
import { createChatCompletionTextNonStream } from "@/lib/llm/adapter";

export async function generateDynamicEncouragement(projectId?: string | null) {
  const setting = await db.appSetting.findUnique({ where: { id: "singleton" } }).catch(() => null);
  const recipientName = setting?.recipientName || process.env.RECIPIENT_NAME || "王悦然";
  const profile = setting?.recipientProfile?.trim();

  if (!profile) return getRandomEncouragement();

  const project = projectId
    ? await db.project.findUnique({
        where: { id: projectId },
        include: { chapters: { orderBy: { index: "desc" }, take: 1 } }
      }).catch(() => null)
    : null;

  const novelContext = [
    project?.title ? `作品标题：${project.title}` : "",
    project?.editedOutline ? `大纲摘要：${project.editedOutline.slice(0, 900)}` : "",
    project?.continuityBible ? `长篇记忆：${project.continuityBible.slice(0, 900)}` : "",
    project?.chapters?.[0]?.summary ? `最近章节摘要：${project.chapters[0].summary.slice(0, 700)}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const generated = await createChatCompletionTextNonStream({
      temperature: 0.85,
      maxTokens: 120,
      messages: [
        {
          role: "system",
          content:
            "你擅长写温柔、真诚、克制、不油腻的中文鼓励语。不要输出解释，不要使用夸张土味表达，不要提到你是 AI。"
        },
        {
          role: "user",
          content: `请根据以下信息，写一句给${recipientName}的鼓励或夸奖。

她的人物画像：
${profile}

当前小说生成内容：
${novelContext || "暂无具体内容。"}

要求：
1. 只输出一句中文。
2. 30 到 70 字。
3. 语气温柔、坚定、具体。
4. 可以结合她的画像和小说内容，但不要剧透太多。
5. 不要使用引号。`
        }
      ]
    });
    return cleanEncouragementMessage(generated) || getRandomEncouragement();
  } catch {
    return getRandomEncouragement();
  }
}
