import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSkillWarnings } from "@/lib/skill-recipe";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const selectedSkillIds = Array.isArray(body.selectedSkillIds) ? body.selectedSkillIds.map(String) : [];
  const targetWordCount = Number(body.targetWordCount || 120000);
  const chapterWordCount = Number(body.chapterWordCount || 4000);
  const warnings = getSkillWarnings(selectedSkillIds);

  if (warnings.some((warning) => warning.includes("亲密度 Skill 同一时间只能选择一个"))) {
    return NextResponse.json({ error: warnings[0], warnings }, { status: 400 });
  }

  const project = await db.project.update({
    where: { id: params.id },
    data: {
      selectedSkillIds: JSON.stringify(selectedSkillIds),
      targetWordCount: Math.max(1000, Math.floor(targetWordCount)),
      chapterWordCount: Math.max(800, Math.floor(chapterWordCount)),
      status: "SKILLS_READY"
    }
  });
  return NextResponse.json({ project, warnings });
}
