type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type StreamInput = {
  model?: string | null;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
};

export class LlmConfigError extends Error {}

function getConfig() {
  const baseUrl = process.env.LLM_BASE_URL;
  const apiKey = process.env.LLM_API_KEY;
  if (!baseUrl || !apiKey || apiKey === "replace_me") {
    throw new LlmConfigError("请先配置中转 API Key");
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
}

export async function* createChatCompletionStream(input: StreamInput): AsyncGenerator<string> {
  const { baseUrl, apiKey } = getConfig();
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: input.model || process.env.DEFAULT_MODEL || "gpt-4.1",
      messages: input.messages,
      temperature: input.temperature ?? 0.75,
      max_tokens: input.maxTokens,
      stream: true
    })
  });

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `模型请求失败：${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const parsed = JSON.parse(payload);
        const text = parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.message?.content ?? "";
        if (text) yield text;
      } catch {
        continue;
      }
    }
  }
}

export async function createChatCompletionText(input: StreamInput) {
  let full = "";
  for await (const chunk of createChatCompletionStream(input)) {
    full += chunk;
  }
  return full;
}

export async function listModels() {
  const configured = process.env.AVAILABLE_MODELS?.split(",").map((item) => item.trim()).filter(Boolean);
  if (configured?.length) return configured;

  const fallback = process.env.DEFAULT_MODEL || "gpt-4.1";
  try {
    const { baseUrl, apiKey } = getConfig();
    const response = await fetch(`${baseUrl}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store"
    });
    if (!response.ok) return [fallback];
    const data = await response.json();
    const models = Array.isArray(data.data) ? data.data.map((model: { id?: string }) => model.id).filter(Boolean) : [];
    return models.length ? models : [fallback];
  } catch {
    return [fallback];
  }
}
