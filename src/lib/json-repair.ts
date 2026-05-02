export function parseModelJson<T>(raw: string): T {
  const withoutFence = raw.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");
  if (start < 0 || end < 0 || end <= start) {
    throw new Error("模型没有返回可解析的 JSON。");
  }

  const jsonText = withoutFence.slice(start, end + 1);
  try {
    return JSON.parse(jsonText) as T;
  } catch {
    throw new Error("章节规划 JSON 解析失败，请重试或换一个模型。");
  }
}
