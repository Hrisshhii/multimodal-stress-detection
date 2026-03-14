import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import User from "@/models/User";
import Session from "@/models/session";
import Interaction from "@/models/interaction";

import { detectEmotionAI } from "@/lib/emotionModel";
import { generateResponse } from "@/lib/chatAi";

import { calculateStressAnalytics } from "@/lib/analytics";

function calculateStress(emotion: string, score: number) {
  if (emotion === "sad" || emotion === "fear") return 0.7 + score * 0.2;
  if (emotion === "anger") return 0.8;
  if (emotion === "happy") return 0.2;
  return 0.5;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { message } = await req.json();

    // detect emotion
    const emotionResult = await detectEmotionAI(message);

    const emotion = emotionResult.emotion;
    const sentimentScore = emotionResult.score;

    const stressScore = calculateStress(emotion, sentimentScore);

    // AI response
    const aiReply = await generateResponse(message, emotion);

    // get or create user
    let user = await User.findOne();

    if (!user) {
      user = await User.create({
        anonymousId: crypto.randomUUID(),
      });
    }

    // create session
    const session = await Session.create({
      userId: user._id,
    });

    // save interaction
    await Interaction.create({
      sessionId: session._id,
      type: "text",
      emotion,
      sentimentScore,
      stressScore,
    });

    // update analytics
    const analytics = await calculateStressAnalytics(
      user._id.toString()
    );

    return NextResponse.json({
      aiReply,
      emotion,
      stressScore,
      analytics,
    });

  } catch (error) {
    console.error("Chat API Error:", error);

    return NextResponse.json(
      { error: "Chat processing failed" },
      { status: 500 }
    );
  }
}