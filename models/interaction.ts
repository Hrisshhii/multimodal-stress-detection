import mongoose from "mongoose";

const InteractionSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },

  type: {
    type: String,
    enum: ["user", "ai", "video", "audio", "text"],
    required: true,
  },
  text: String,

  emotion: String,
  sentimentScore: Number,
  stressScore: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Interaction || mongoose.model("Interaction", InteractionSchema);