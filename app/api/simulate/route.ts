import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/session";
import Interaction from "@/models/interaction";

const emotions = ["happy", "sad", "neutral", "angry", "fear"];

function randomItem(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomStress() {
  return Number((Math.random() * 1).toFixed(2));
}

export async function GET() {
  await connectDB();

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

  // create fake interactions
  for (let i = 0; i < 10; i++) {
    await Interaction.create({
      sessionId: session._id,
      type: randomItem(["text", "voice", "camera"]),
      emotion: randomItem(emotions),
      sentimentScore: randomStress(),
      stressScore: randomStress(),
    });
  }

  return NextResponse.json({
    message: "Simulated AI interactions created ✅",
  });
}