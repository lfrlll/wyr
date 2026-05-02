import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const title = String(body.title || "未命名作品").trim();
  const sourceText = String(body.sourceText || "").trim();
  const modelId = String(body.modelId || process.env.DEFAULT_MODEL || "gpt-4.1").trim();

  const project = await db.project.create({
    data: {
      title,
      sourceText,
      modelId
    }
  });

  return NextResponse.json({ project });
}
