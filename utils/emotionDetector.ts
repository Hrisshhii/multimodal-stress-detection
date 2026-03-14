export function detectEmotion(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("sad") || lower.includes("tired"))
    return { emotion: "sad", sentiment: 0.3, stress: 0.7 };

  if (lower.includes("angry") || lower.includes("frustrated"))
    return { emotion: "anger", sentiment: 0.2, stress: 0.8 };

  if (lower.includes("happy") || lower.includes("good"))
    return { emotion: "happy", sentiment: 0.8, stress: 0.2 };

  return { emotion: "neutral", sentiment: 0.5, stress: 0.5 };
}