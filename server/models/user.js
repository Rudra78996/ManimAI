import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  dailyQuota: { type: Number, default: 4 },
  lastQuotaReset: { type: Date, default: Date.now },
  usedQuota: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
