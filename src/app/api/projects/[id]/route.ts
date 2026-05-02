import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const project = await db.project.findUnique({
    where: { id: params.id },
    include: { chapters: { orderBy: { index: "asc" } } }
  });
  if (!project) {
    return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const project = await db.project.update({
    where: { id: params.id },
    data: {
      title: String(body.title || "未命名作品").trim(),
      sourceText: String(body.sourceText || "").trim(),
      modelId: String(body.modelId || process.env.DEFAULT_MODEL || "gpt-4.1").trim()
    }
  });
  return NextResponse.json({ project });
}
