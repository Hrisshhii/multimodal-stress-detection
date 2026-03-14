import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Interaction from "@/models/interaction";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const interactions = await Interaction.find({
    sessionId: id,
  }).sort({ createdAt: 1 });

  const messages = interactions.map((i) => ({
    role: i.type,
    text: i.text,
  }));

  return NextResponse.json(messages);
}