import mongoose from "mongoose";

const flagSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    type: {
      type: String,
      enum: ["general", "product", "order", "user"],
      default: "general",
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected", "closed"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Flag", flagSchema);
