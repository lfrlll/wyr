import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildConfessionBody, getAppSetting } from "@/lib/gate";

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
  return NextResponse.json({ setting, renderedBody: buildConfessionBody(setting.confessionBody) });
}

export async function PATCH(request: Request) {
  const denied = assertOwnerAccess(request);
  if (denied) return denied;

  const body = await request.json();
  const setting = await db.appSetting.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      recipientName: String(body.recipientName || "王悦然"),
      confessionTitle: String(body.confessionTitle || "给王悦然的一封信"),
      confessionBody: String(body.confessionBody || "")
    },
    update: {
      recipientName: String(body.recipientName || "王悦然"),
      confessionTitle: String(body.confessionTitle || "给王悦然的一封信"),
      confessionBody: String(body.confessionBody || "")
    }
  });
  return NextResponse.json({ setting, renderedBody: buildConfessionBody(setting.confessionBody) });
}
