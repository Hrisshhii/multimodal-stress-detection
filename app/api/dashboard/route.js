import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import User from "@/models/User";
import Interaction from "@/models/interaction";
import StressAnalytics from "@/models/StressAnalytics";
import Session from "@/models/session";

export async function GET() {
  await connectDB();

  const user = await User.findOne();
  if (!user)
    return NextResponse.json({ message: "No user found" });

  // latest analytics
  const analytics = await StressAnalytics
    .findOne({ userId: user._id })
    .sort({ calculatedAt: -1 });

  // interactions timeline
  const sessions = await Session.find({ userId: user._id });

  const sessionIds = sessions.map(s => s._id);

  const interactions = await Interaction.find({
    sessionId: { $in: sessionIds },
  }).sort({ createdAt: 1 });

  const stressTimeline = interactions.map(i => ({
    time: i.createdAt,
    stress: i.stressScore,
  }));

  return NextResponse.json({
    avgStress: analytics?.avgStressScore || 0,
    dominantEmotion: analytics?.dominantEmotion || "neutral",
    interactionCount: analytics?.interactionCount || 0,
    stressTimeline,
  });
}