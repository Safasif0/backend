import express from "express";
import {
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  deleteProductByAdmin,
  getMyProducts,
} from "../controllers/products.controller.js";

import { auth } from "../Middleware/auth.js";
import upload from "../Middleware/upload.js";

const router = express.Router();

// ⭐ لازم /me قبل /:id
router.get("/me", auth("seller"), getMyProducts);

// ✅ ADD PRODUCT (التعديل هنا)
router.post(
  "/",
  auth("seller"),
  upload.single("image"),
  addProduct
);

// GET PRODUCT BY ID
router.get("/:id", getProductById);

// UPDATE & DELETE (SELLER)
router.put(
  "/:id",
  auth("seller"),
  upload.single("image"),
  updateProduct
);

router.delete("/:id", auth("seller"), deleteProduct);

// ADMIN
router.delete("/admin/:id", auth("admin"), deleteProductByAdmin);

export default router;
