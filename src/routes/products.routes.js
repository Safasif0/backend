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
  getAllProducts, // ✅ لازم دي
} from "../controllers/products.controller.js";

const router = express.Router();

/* ========= BUYER / PUBLIC ========= */
// لازم تبقى فوق
router.get("/", getAllProducts);

/* ========= SELLER ========= */

// ADD product
router.post("/", auth("seller"), upload.array("image", 5), addProduct);

// MY products
router.get("/me", auth("seller"), getMyProducts);

// UPDATE product
router.put("/:id", auth("seller"), upload.array("image", 5), updateProduct);

// DELETE product by seller
router.delete("/seller/:id", auth("seller"), deleteProductBySeller);

// DELETE product by admin
router.delete("/admin/:id", auth("admin"), deleteProductByAdmin);

/* ========= COMMON ========= */

// GET product by id (آخر حاجة)
router.get("/:id", getProductById);

export default router;
