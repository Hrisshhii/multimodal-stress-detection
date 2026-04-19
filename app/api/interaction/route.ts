import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import User from "@/models/User";
import Session from "@/models/session";
import Interaction from "@/models/interaction";

import { calculateStressAnalytics } from "@/lib/analytics";

export async function POST(req: Request) {
  await connectDB(); // ⚠️ you also forgot this

  let body;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // ✅ FIX: extract values from body
  const { type, emotion, sentimentScore, stressScore, tone } = body;

  // ---- get or create user ----
  let user = await User.findOne();

  if (!user) {
    user = await User.create({
      anonymousId: "default_user",
    });
  }

  // ---- create session ----
  let session = await Session.findOne({ userId: user._id });

  if (!session) {
    session = await Session.create({
      userId: user._id,
    });
  }

  // ---- save interaction ----
  const interaction = await Interaction.create({
    sessionId: session._id,
    type,
    emotion,
    sentimentScore,
    stressScore,
    toneStress: tone?.toneStress || 0,
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