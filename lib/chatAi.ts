export async function generateResponse(message: string, emotion: string) {
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

            Rules:
            - If giving tips, use bullet points
            - Keep answers concise and easy to read
            - Avoid long walls of text
            - Be supportive and conversational
            `
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  const data = await res.json();

  console.log("Groq:", data);

  return (
    data?.choices?.[0]?.message?.content ||
    "I'm here to listen. Tell me more about what's bothering you."
  );
}