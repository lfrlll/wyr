import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const editedOutline = String(body.editedOutline || "").trim();
  if (!editedOutline) {
    return NextResponse.json({ error: "大纲不能为空" }, { status: 400 });
  }
  const project = await db.project.update({
    where: { id: params.id },
    data: { editedOutline, status: "OUTLINE_READY" }
  });
  return NextResponse.json({ project });
}
