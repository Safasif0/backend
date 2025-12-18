import express from "express";
import { auth } from "../Middleware/auth.js";

import {
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orders.controller.js";

const router = express.Router();

// 👇 أوردرات السيلر
router.get("/seller", auth("seller"), getSellerOrders);

// 👇 تفاصيل أوردر
router.get("/:id", auth("seller"), getOrderById);

// 👇 تغيير الحالة
router.put("/:id/status", auth("seller"), updateOrderStatus);

export default router;
