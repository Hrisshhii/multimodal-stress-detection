import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/session";
import User from "@/models/User";

export async function POST() {
  await connectDB();

  let user = await User.findOne();

  if (!user) {
    user = await User.create({
      anonymousId: crypto.randomUUID(),
    });
  }

  const session = await Session.create({
    userId: user._id,
  });

  return NextResponse.json(session);
}