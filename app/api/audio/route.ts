export const runtime = "nodejs";

import { analyzeAudio } from "@/lib/audioAnalysis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as Blob;

    const groqForm = new FormData();
    groqForm.append("file", file, "audio.webm");
    groqForm.append("model", "whisper-large-v3");

    const buffer=Buffer.from(await file.arrayBuffer());
    const tone=analyzeAudio(buffer);

    const response=await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: groqForm,
      }
    );

    const data=await response.json();
    console.log("🎤 AUDIO API HIT");
    console.log("Tone:", tone);

    return NextResponse.json({
      text: data.text,
      tone,
    });

  }catch(error){
    console.error("Audio API Error:", error);
    return NextResponse.json(
      { error: "Audio processing failed" },
      { status: 500 }
    );
  }
}