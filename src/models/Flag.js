import mongoose from "mongoose";

const flagSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ["product", "order"],
      required: true,
    },

    targetModel: {
      type: String,
      enum: ["Product", "Order"],
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetModel",
    },

    reason: {
      type: String,
      required: true,
    },

    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Flag", flagSchema);
