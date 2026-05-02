import { NextResponse } from "next/server";
import { getRandomEncouragement } from "@/lib/encouragement";

export async function GET() {
  return NextResponse.json({ message: getRandomEncouragement() });
}
