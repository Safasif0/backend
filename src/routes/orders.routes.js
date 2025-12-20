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
} from "../controllers/orders.controller.js";

const router = express.Router();

// ================= BUYER =================
router.post("/", auth("buyer"), createOrder);
router.get("/my", auth("buyer"), getBuyerOrders);

// ================= SELLER =================
router.get("/seller", auth("seller"), getSellerOrders);
router.put("/:id/status", auth("seller"), updateOrderStatus);

// ================= ORDER DETAILS =================
router.get("/:id", auth(), getOrderById);

// ================= BUYER REVIEW =================
router.put("/:id/review", auth("buyer"), addOrderReview);

// ================= PUBLIC PRODUCT REVIEWS =================
router.get("/product/:productId/reviews", getProductReviews);

export default router;
