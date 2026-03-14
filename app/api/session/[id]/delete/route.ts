import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/session";
import Interaction from "@/models/interaction";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  await Interaction.deleteMany({ sessionId: id });
  await Session.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}