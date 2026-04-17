
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
    console.log('ai');
    const body = await req.json();
    const { message, sessionId, tone } = body;

    // detect emotion
    const emotionResult = await detectEmotionAI(message);

    const emotion = emotionResult.emotion;
    const sentimentScore = emotionResult.score;

    const textScore = calculateStress(emotion, sentimentScore);
    const toneStress=tone?.toneStress || 0;
    const finalStress=(textScore*0.7)+(toneStress*0.3);
    const stressScore=finalStress;

    console.log("Text Stress:", textScore);
    console.log("Tone Stress:", toneStress);
    console.log("Final Stress:", stressScore);

    // AI response
    const aiReply = await generateResponse(message, emotion);

    // get or create user
    let user = await User.findOne();

    if (!user) {
      user = await User.create({
        anonymousId: crypto.randomUUID(),
      });
    }

    let session;

    if (sessionId) {
      session = await Session.findById(sessionId);
    } else {
      session = await Session.create({
        userId: user._id,
      });
    }

    if(session.title==="New Chat"){
      session.title=message.slice(0,40);
      await session.save();
    }

    // save interaction
    await Interaction.create({
      sessionId: session._id,
      type: "user",
      text: message,
      emotion,
      sentimentScore,
      stressScore,
    });

    await Interaction.create({
      sessionId: session._id,
      type: "ai",
      text: aiReply,
    });

    // update analytics
    const analytics = await calculateStressAnalytics(
      user._id.toString()
    );
    console.log("Chat Request:",{message,sessionId});
    console.log("Saving interactions");

    return NextResponse.json({
      aiReply,
      emotion,
      stressScore,
      analytics,
      sessionId:session._id,
    });
  } catch (error) {
    console.error("Chat API Error:", error);

    return NextResponse.json(
      { error: "Chat processing failed" },
      { status: 500 }
    );
  }
}