import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/session";
import Interaction from "@/models/interaction";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const user = await User.findOne();

  if (!user) return NextResponse.json([]);

  const sessions = await Session.find({
    userId: user._id,
  }).sort({ startedAt: -1 });

  // keep only sessions that have messages
  const validSessions = [];

  for (const s of sessions) {
    const count = await Interaction.countDocuments({
      sessionId: s._id,
    });

    if (count > 0) validSessions.push(s);
  }

  return NextResponse.json(validSessions);
}