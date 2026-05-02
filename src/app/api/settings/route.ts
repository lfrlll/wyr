import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildConfessionBody, getAppSetting } from "@/lib/gate";
import { getLlmRuntimeConfig } from "@/lib/llm/adapter";

export const runtime = "nodejs";

function assertOwnerAccess(request: Request) {
  const accessCode = process.env.OWNER_ACCESS_CODE?.trim();
  if (!accessCode || accessCode === "replace_me_optional") return null;
  if (request.headers.get("x-owner-access-code") === accessCode) return null;
  return NextResponse.json({ error: "需要主人访问口令" }, { status: 401 });
}

export async function GET(request: Request) {
  const denied = assertOwnerAccess(request);
  if (denied) return denied;

  const setting = await getAppSetting();
  const { llmApiKey: _llmApiKey, ...safeSetting } = setting;
  const renderedBody = buildConfessionBody(setting.confessionBody);
  const runtimeConfig = await getLlmRuntimeConfig().catch(() => null);
  const llmConfig = {
    llmBaseUrl: setting.llmBaseUrl || process.env.LLM_BASE_URL || "",
    hasLlmApiKey: Boolean(setting.llmApiKey || process.env.LLM_API_KEY),
    defaultModel: setting.defaultModel || runtimeConfig?.defaultModel || process.env.DEFAULT_MODEL || "",
    availableModels: setting.availableModels || runtimeConfig?.availableModels || process.env.AVAILABLE_MODELS || "",
    apiKeySource: setting.llmApiKey ? "settings" : process.env.LLM_API_KEY ? "environment" : "missing"
  };
  return NextResponse.json({
    setting: safeSetting,
    editableBody: setting.confessionBody?.trim() ? setting.confessionBody : renderedBody,
    renderedBody,
    llmConfig
  });
}

export async function PATCH(request: Request) {
  const denied = assertOwnerAccess(request);
  if (denied) return denied;

  const body = await request.json();
  const llmApiKey = String(body.llmApiKey || "").trim();
  const setting = await db.appSetting.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      recipientName: String(body.recipientName || "王悦然"),
      confessionTitle: String(body.confessionTitle || "给王悦然的一封信"),
      confessionBody: String(body.confessionBody || ""),
      llmBaseUrl: String(body.llmBaseUrl || process.env.LLM_BASE_URL || ""),
      ...(llmApiKey ? { llmApiKey } : {}),
      defaultModel: String(body.defaultModel || process.env.DEFAULT_MODEL || ""),
      availableModels: String(body.availableModels || process.env.AVAILABLE_MODELS || "")
    },
    update: {
      recipientName: String(body.recipientName || "王悦然"),
      confessionTitle: String(body.confessionTitle || "给王悦然的一封信"),
      confessionBody: String(body.confessionBody || ""),
      llmBaseUrl: String(body.llmBaseUrl || ""),
      ...(llmApiKey ? { llmApiKey } : {}),
      defaultModel: String(body.defaultModel || ""),
      availableModels: String(body.availableModels || "")
    }
  });
  const { llmApiKey: _llmApiKey, ...safeSetting } = setting;
  const renderedBody = buildConfessionBody(setting.confessionBody);
  const llmConfig = {
    llmBaseUrl: setting.llmBaseUrl || process.env.LLM_BASE_URL || "",
    hasLlmApiKey: Boolean(setting.llmApiKey || process.env.LLM_API_KEY),
    defaultModel: setting.defaultModel || process.env.DEFAULT_MODEL || "",
    availableModels: setting.availableModels || process.env.AVAILABLE_MODELS || "",
    apiKeySource: setting.llmApiKey ? "settings" : process.env.LLM_API_KEY ? "environment" : "missing"
  };
  return NextResponse.json({
    setting: safeSetting,
    editableBody: setting.confessionBody?.trim() ? setting.confessionBody : renderedBody,
    renderedBody,
    llmConfig
  });
}
