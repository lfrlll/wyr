import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function assertOwnerAccess(request: Request) {
  const accessCode = process.env.OWNER_ACCESS_CODE?.trim();
  if (!accessCode || accessCode === "replace_me_optional") return null;
  if (request.headers.get("x-owner-access-code") === accessCode) return null;
  return NextResponse.json({ error: "需要主人访问口令" }, { status: 401 });
}

export async function POST(request: Request) {
  const denied = assertOwnerAccess(request);
  if (denied) return denied;

  const setting = await db.appSetting.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      recipientName: process.env.RECIPIENT_NAME || "王悦然",
      confessionTitle: "给王悦然的一封信",
      confessionCompletedAt: null,
      firstProjectId: null
    },
    update: {
      confessionCompletedAt: null,
      firstProjectId: null
    }
  });

  return NextResponse.json({ setting });
}
