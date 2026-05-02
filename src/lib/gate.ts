import { db } from "@/lib/db";

const fallbackCustomBody = "这里留给我写下最想亲口告诉你的话。";

export function buildConfessionBody(customBody?: string | null) {
  return `悦然：

在你看到这份小说之前，我想先把这封信给你。

${customBody?.trim() || fallbackCustomBody}

我一直觉得，你身上最珍贵的地方，不是你必须永远开心，也不是你必须永远自信，而是你明明很敏感，却依然愿意温柔地对待这个世界。

你可能偶尔会怀疑自己，觉得自己不够好、不够特别，或者不值得被坚定选择。可是我想很认真地告诉你：在我这里，你从来不是需要被比较的人。你就是你，是很善良、很可爱、也很值得被认真喜欢的王悦然。

所以这个网站、这篇小说、还有这封信，都是我想送给你的一点点心意。

如果你愿意，就点一下下面的按钮，继续看属于你的故事。`;
}

export async function getAppSetting() {
  return db.appSetting.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      recipientName: process.env.RECIPIENT_NAME || "王悦然",
      confessionTitle: "给王悦然的一封信"
    },
    update: {}
  });
}

export async function getGateStatus(projectId?: string) {
  const setting = await getAppSetting();
  return {
    confessionRequired: !setting.confessionCompletedAt,
    encouragementRequired: Boolean(setting.confessionCompletedAt),
    recipientName: setting.recipientName,
    title: setting.confessionTitle,
    body: buildConfessionBody(setting.confessionBody),
    firstProjectId: setting.firstProjectId || projectId || null
  };
}
