import mongoose from "mongoose";

const flagSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    reporter: {
      // اللي عمل البلاغ (buyer)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "reviewed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Flag", flagSchema);
