import express from "express";
import Order from "../models/Order.js";
import { auth } from "../Middleware/auth.js";

const router = express.Router();

// ===============================
// CREATE ORDER (Buyer)
// ===============================
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// GET BUYER ORDERS (My Orders)
// ===============================
router.get("/my", auth("buyer"), async (req, res) => {
  try {
    const orders = await Order.find({ "buyer._id": req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "title image price")
      .select("items totalPrice status createdAt");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// GET SELLER ORDERS
// ===============================
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const orders = await Order.find({
      "items.seller": req.params.sellerId,
    }).populate("items.product");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
