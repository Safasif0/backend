import express from "express";
import { auth } from "../Middleware/auth.js";
import {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  addOrderReview,
} from "../controllers/orders.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Orders management
 */

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
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", auth(), getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status (Seller)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id/status", auth("seller"), updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/review:
 *   put:
 *     summary: Add rating & comment (Buyer)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */



router.post("/", auth("buyer"), createOrder);
router.get("/my", auth("buyer"), getBuyerOrders);

router.get("/seller", auth("seller"), getSellerOrders);
router.put("/:id/status", auth("seller"), updateOrderStatus);

router.get("/:id", auth(), getOrderById);

// ⭐ Review
router.put("/:id/review", auth("buyer"), addOrderReview);

router.post("/", auth("buyer"), createOrder);
router.get("/my", auth("buyer"), getBuyerOrders);

router.get("/product/:productId/reviews", getProductReviews);

router.get("/:id", auth(), getOrderById);
router.put("/:id/status", auth("seller"), updateOrderStatus);
router.put("/:id/review", auth("buyer"), addOrderReview);

export default router;