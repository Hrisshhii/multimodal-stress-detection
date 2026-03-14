import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { calculateStressAnalytics } from "@/lib/analytics";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const user = await User.findOne();

  if (!user)
    return NextResponse.json({ message: "No user found" });

  const analytics = await calculateStressAnalytics(
    user._id.toString()
  );

  return NextResponse.json({
    message: "Analytics Generated ✅",
    analytics,
  });
}