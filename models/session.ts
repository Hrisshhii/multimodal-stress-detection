import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  startedAt: {
    type: Date,
    default: Date.now,
  },

  endedAt: Date,
});

export default mongoose.models.Session ||
  mongoose.model("Session", SessionSchema);