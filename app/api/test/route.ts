import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const user = await User.create({
    anonymousId: crypto.randomUUID(),
  });

  return NextResponse.json({
    message: "DB Connected ✅",
    user,
  });
}