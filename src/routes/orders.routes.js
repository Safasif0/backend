import express from "express";
import { createOrder, getMyOrders } from "../controllers/orders.controller.js";
import { auth } from "../Middleware/auth.js";

const router = express.Router();

// buyer only
router.post("/", auth("buyer"), createOrder);

// buyer only
router.get("/me", auth("buyer"), getMyOrders);
import { cancelOrder, getOrderById } from "../controllers/orders.controller.js";
router.put("/:id/cancel", auth("buyer"), cancelOrder);

export default router;
