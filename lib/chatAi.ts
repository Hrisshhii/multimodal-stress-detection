export async function generateResponse(message: string, emotion: string) {
  const toneGuide: Record<string, string> = {
    sad: "Respond with empathy and emotional support.",
    anger: "Respond calmly and help the user relax.",
    fear: "Provide reassurance and grounding advice.",
    happy: "Encourage the positive feeling.",
    neutral: "Be supportive and conversational."
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
            You are a supportive mental wellness assistant helping users manage stress.
            Detected user emotion: ${emotion}

            Rules:
            - ${toneGuide[emotion] || toneGuide.neutral}
            - If giving tips, use bullet points
            - Keep answers concise and easy to read
            - Avoid long walls of text
            - Ask follow-up questions to continue conversation
            - Speak naturally like a supportive coach
            - Be supportive and conversational
            `
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature:0.6,
      max_tokens:300
    }),
  });

  const data = await res.json();

  console.log("Groq:", data);

  return (
    data?.choices?.[0]?.message?.content || "I'm here to listen. Tell me more about what's bothering you."
  );
}