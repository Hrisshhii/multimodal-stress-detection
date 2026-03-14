export async function detectEmotionAI(text: string) {
  const res = await fetch(
    "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  const data = await res.json();

  console.log("HuggingFace response:", data);

  if (!Array.isArray(data)) {
    return {
      emotion: "neutral",
      score: 0.5,
    };
  }

  const prediction = data[0][0];

  return {
    emotion: prediction.label.toLowerCase(),
    score: prediction.score,
  };
}