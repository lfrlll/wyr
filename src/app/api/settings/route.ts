import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildConfessionBody, getAppSetting } from "@/lib/gate";

export const runtime = "nodejs";

export async function GET() {
  const setting = await getAppSetting();
  return NextResponse.json({ setting, renderedBody: buildConfessionBody(setting.confessionBody) });
}

export async function PATCH(request: Request) {
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
