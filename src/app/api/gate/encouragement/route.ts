import { NextResponse } from "next/server";
import { generateDynamicEncouragement } from "@/lib/dynamic-encouragement";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  return NextResponse.json({ message: await generateDynamicEncouragement(projectId) });
}
