import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const projectId = body.projectId ? String(body.projectId) : null;
  const setting = await db.appSetting.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      recipientName: process.env.RECIPIENT_NAME || "王悦然",
      confessionTitle: "给王悦然的一封信",
      confessionCompletedAt: new Date(),
      firstProjectId: projectId
    },
    update: {
      confessionCompletedAt: new Date(),
      firstProjectId: projectId
    }
  });
  return NextResponse.json({ setting });
}
