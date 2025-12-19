import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      name: String,
      phone: String,
      address: String,
      city: String,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        price: Number,
        qty: Number,
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    totalPrice: Number,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
