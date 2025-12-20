import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },

    // 🖼️ image array
    image: {
      type: [String],
      default: [],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: { type: Boolean, default: true },
    deliveryTime: { type: Number, default: 3 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
