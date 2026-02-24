import Interaction from "@/models/interaction";
import StressAnalytics from "@/models/StressAnalytics";

export async function calculateStressAnalytics(userId: string) {
  const interactions = await Interaction.find({})
    .populate({
      path: "sessionId",
      match: { userId },
    });

  const validInteractions = interactions.filter(
    (i) => i.sessionId !== null
  );

  if (validInteractions.length === 0) return null;


  const avgStress =
    validInteractions.reduce(
      (sum, i) => sum + (i.stressScore || 0),
      0
    ) / validInteractions.length;

  const emotionCount: Record<string, number> = {};

  validInteractions.forEach((i) => {
    if (!i.emotion) return;
    emotionCount[i.emotion] =
      (emotionCount[i.emotion] || 0) + 1;
  });

  const dominantEmotion =
    Object.entries(emotionCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "neutral";

  
  const analytics = await StressAnalytics.create({
    userId,
    avgStressScore: avgStress,
    dominantEmotion,
    interactionCount: validInteractions.length,
  });

  return analytics;
}