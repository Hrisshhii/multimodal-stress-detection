import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as Blob;

    const groqForm = new FormData();
    groqForm.append("file", file, "audio.webm");
    groqForm.append("model", "whisper-large-v3");

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

    return NextResponse.json({
      text: data.text || "",
    });

  }catch(error){
    console.error("Audio API Error:", error);
    return NextResponse.json(
      { error: "Audio processing failed" },
      { status: 500 }
    );
  }
}