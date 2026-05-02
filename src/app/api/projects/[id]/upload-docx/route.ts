import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseDocx } from "@/lib/docx-parse";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "请上传 .docx 文件" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const text = await parseDocx(buffer);
  const project = await db.project.update({
    where: { id: params.id },
    data: { uploadedDocText: text }
  });
  return NextResponse.json({ text, project });
}
