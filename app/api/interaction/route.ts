import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import User from "@/models/User";
import Session from "@/models/session";
import Interaction from "@/models/interaction";

import { calculateStressAnalytics } from "@/lib/analytics";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const { type, emotion, sentimentScore, stressScore } = body;

  // ---- get or create user ----
  let user = await User.findOne();

  if (!user) {
    user = await User.create({
      anonymousId: crypto.randomUUID(),
    });
  }

  // ---- create session ----
  const session = await Session.create({
    userId: user._id,
  });

  // ---- save interaction ----
  const interaction = await Interaction.create({
    sessionId: session._id,
    type,
    emotion,
    sentimentScore,
    stressScore,
  });

  // ---- AUTO analytics update ----
  const analytics = await calculateStressAnalytics(
    user._id.toString()
  );

  return NextResponse.json({
    message: "Interaction stored + analytics updated ✅",
    interaction,
    analytics,
  });
}