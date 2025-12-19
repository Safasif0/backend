import express from "express";
import {
  getAllProducts,
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

// ✅ GET ALL PRODUCTS (BUYER)
router.get("/", getAllProducts);

// ⭐ SELLER PRODUCTS
router.get("/me", auth("seller"), getMyProducts);

// ✅ ADD PRODUCT
router.post(
  "/",
  auth("seller"),
  upload.single("image"),
  addProduct
);

// ✅ GET PRODUCT BY ID
router.get("/:id", getProductById);

// UPDATE
router.put(
  "/:id",
  auth("seller"),
  upload.single("image"),
  updateProduct
);
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select("title description price image seller")
      .populate("seller", "_id name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", auth("seller"), deleteProduct);

// ADMIN DELETE
router.delete("/admin/:id", auth("admin"), deleteProductByAdmin);

export default router;
