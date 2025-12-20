import express from "express";
import { auth } from "../Middleware/auth.js";
import {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orders.controller.js";

const router = express.Router();

// BUYER
router.post("/", auth("buyer"), createOrder);
router.get("/my", auth("buyer"), getBuyerOrders);

// SELLER
router.get("/seller", auth("seller"), getSellerOrders);
router.put("/:id/status", auth("seller"), updateOrderStatus);

// BOTH
router.get("/:id", auth(), getOrderById);
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create order (Buyer)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/", auth("buyer"), createOrder);

/**
 * @swagger
 * /orders/my:
 *   get:
 *     summary: Get my orders (Buyer)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get("/my", auth("buyer"), getBuyerOrders);

/**
 * @swagger
 * /orders/seller:
 *   get:
 *     summary: Get seller orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get("/seller", auth("seller"), getSellerOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.get("/:id", auth(), getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id/status", auth("seller"), updateOrderStatus);


export default router;
