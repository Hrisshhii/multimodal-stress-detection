import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/session";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;   // 👈 REQUIRED in Next.js 16
    const { title } = await req.json();

    const session = await Session.findByIdAndUpdate(
      id,
      { title },
      { returnDocument: "after" }  // replaces deprecated `new: true`
    );

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(session);

  } catch (error) {
    console.error("Rename API Error:", error);

    return NextResponse.json(
      { error: "Rename failed" },
      { status: 500 }
    );
  }
}