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
} from "../controllers/products.controller.js";

const router = express.Router();

// ADD product
router.post("/", auth("seller"), upload.array("image", 5), addProduct);

// MY products
router.get("/me", auth("seller"), getMyProducts);

// GET product
router.get("/:id", getProductById);

// UPDATE product
router.put("/:id", auth("seller"), upload.array("image", 5), updateProduct);

// DELETE product by seller
router.delete("/seller/:id", auth("seller"), deleteProductBySeller);

// DELETE product by admin
router.delete("/admin/:id", auth("admin"), deleteProductByAdmin);
// PUBLIC / BUYER - get all products
router.get("/", getAllProducts);

export default router;
