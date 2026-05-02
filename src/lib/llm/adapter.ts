import { db } from "@/lib/db";

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

function clean(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "replace_me" || trimmed === "replace_with_new_yunwu_key") return "";
  return trimmed.replace(/^["']|["']$/g, "");
}

export async function getLlmRuntimeConfig() {
  const setting = await db.appSetting.findUnique({ where: { id: "singleton" } }).catch(() => null);
  const baseUrl = clean(setting?.llmBaseUrl) || clean(process.env.LLM_BASE_URL);
  const apiKey = clean(setting?.llmApiKey) || clean(process.env.LLM_API_KEY);
  const defaultModel = clean(setting?.defaultModel) || clean(process.env.DEFAULT_MODEL) || "gpt-4.1";
  const availableModels = clean(setting?.availableModels) || clean(process.env.AVAILABLE_MODELS);

  if (!baseUrl || !apiKey || apiKey === "replace_me") {
    throw new LlmConfigError("请先配置中转 API Key");
  }
  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    apiKey,
    defaultModel,
    availableModels
  };
}

export async function* createChatCompletionStream(input: StreamInput): AsyncGenerator<string> {
  const { baseUrl, apiKey, defaultModel } = await getLlmRuntimeConfig();
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: input.model || defaultModel,
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

export async function createChatCompletionTextNonStream(input: StreamInput) {
  const { baseUrl, apiKey, defaultModel } = await getLlmRuntimeConfig();
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: input.model || defaultModel,
      messages: input.messages,
      temperature: input.temperature ?? 0.75,
      max_tokens: input.maxTokens,
      stream: false
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `模型请求失败：${response.status}`);
  }

  const data = await response.json();
  return String(data.choices?.[0]?.message?.content || "").trim();
}

export async function listModels() {
  let config: Awaited<ReturnType<typeof getLlmRuntimeConfig>>;
  try {
    config = await getLlmRuntimeConfig();
  } catch {
    const fallback = clean(process.env.DEFAULT_MODEL) || "gpt-4.1";
    const configured = clean(process.env.AVAILABLE_MODELS)
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return configured?.length ? configured : [fallback];
  }
  const configured = config.availableModels?.split(",").map((item) => item.trim()).filter(Boolean);
  if (configured?.length) return configured;

  const fallback = config.defaultModel;
  try {
    const { baseUrl, apiKey } = config;
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
