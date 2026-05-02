import { NextResponse } from "next/server";
import { getGateStatus } from "@/lib/gate";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(await getGateStatus(params.id));
}
