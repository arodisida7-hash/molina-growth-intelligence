import { NextResponse } from "next/server";

import { generateBoardReport } from "@/lib/report";

export async function GET() {
  return NextResponse.json(generateBoardReport());
}
