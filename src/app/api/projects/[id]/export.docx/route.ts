import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exportProjectDocx, safeDocxFilename } from "@/lib/docx-export";
import { getAppSetting } from "@/lib/gate";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const project = await db.project.findUnique({
    where: { id: params.id },
    include: { chapters: { orderBy: { index: "asc" } } }
  });
  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  if (project.status !== "GENERATED") return NextResponse.json({ error: "项目还没有生成完成" }, { status: 400 });

  const setting = await getAppSetting();
  if (!setting.confessionCompletedAt) {
    return NextResponse.json({ locked: true, reason: "CONFESSION_REQUIRED" }, { status: 423 });
  }

  const buffer = await exportProjectDocx(project);
  await db.exportLog.create({ data: { projectId: project.id, type: "docx" } });
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${safeDocxFilename(project.id)}"`
    }
  });
}
