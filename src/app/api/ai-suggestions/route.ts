import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {

    console.log("fired  POST REQUEST")
  return NextResponse.json("HEllo");
}