import express from "express";
import { auth } from "../Middleware/auth.js";
import {
  createOrder,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/orders.controller.js";

const router = express.Router();

// buyer
router.post("/", auth("buyer"), createOrder);

// seller
router.get("/seller", auth("seller"), getSellerOrders);
router.put("/:id/status", auth("seller"), updateOrderStatus);

export default router;
