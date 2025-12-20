import express from "express";
import { auth } from "../Middleware/auth.js";
import upload from "../Middleware/upload.js";

import {
  addProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProductBySeller,
  deleteProductByAdmin,
  getAllProducts, // ✅ مهم
} from "../controllers/products.controller.js";

const router = express.Router();

/* ================= BUYER (PUBLIC) ================= */
// لازم يبقى فوق
router.get("/", getAllProducts);

/* ================= SELLER ================= */

// MY products
router.get("/me", auth("seller"), getMyProducts);

// ADD product
router.post("/", auth("seller"), upload.array("image", 5), addProduct);

// UPDATE product
router.put("/:id", auth("seller"), upload.array("image", 5), updateProduct);

// DELETE product by seller
router.delete("/seller/:id", auth("seller"), deleteProductBySeller);

// DELETE product by admin
router.delete("/admin/:id", auth("admin"), deleteProductByAdmin);

/* ================= COMMON ================= */

// GET product by id (آخر حاجة)
router.get("/:id", getProductById);
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (Public)
 *     tags: [Products]
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add product (Seller)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", auth("seller"), upload.array("image", 5), addProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 */
router.get("/:id", getProductById);

export default router;
