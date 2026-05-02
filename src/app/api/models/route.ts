import { NextResponse } from "next/server";
import { listModels } from "@/lib/llm/adapter";

export const runtime = "nodejs";

export async function GET() {
  const models = await listModels();
  return NextResponse.json({ models });
}
