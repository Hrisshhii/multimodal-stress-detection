import mongoose from "mongoose";

const StressAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  avgStressScore: Number,
  dominantEmotion: String,
  interactionCount: Number,

  calculatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.StressAnalytics ||
  mongoose.model("StressAnalytics", StressAnalyticsSchema);