import express from "express";
import { auth } from "../Middleware/auth.js";
import {
  createOrder,
  getBuyerOrders,
  getOrderById,
  updateOrderStatus,
  addOrderReview,
  getProductReviews,
  getSellerOrders,
  getSellerReviews,
} from "../controllers/orders.controller.js";

const router = express.Router();
router.get("/seller/test", (req, res) => {
  res.json({ ok: true });
});

// ================= BUYER =================
router.post("/", auth("buyer"), createOrder);
router.get("/my", auth("buyer"), getBuyerOrders);

// ================= SELLER =================
router.get("/seller", auth("seller"), getSellerOrders);
router.get("/seller/reviews", auth("seller"), getSellerReviews);
router.put("/:id/status", auth("seller"), updateOrderStatus);

// ================= PUBLIC PRODUCT REVIEWS =================
router.get("/product/:productId/reviews", getProductReviews);

// ================= ORDER DETAILS (آخر حاجة خالص) =================
router.get("/:id", auth(), getOrderById);

// ================= BUYER REVIEW =================
router.put("/:id/review", auth("buyer"), addOrderReview);

export default router;
