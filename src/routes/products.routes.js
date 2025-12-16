import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts
} from "../controllers/products.controller.js";
import { auth } from "../Middleware/auth.js";
import { deleteProductByAdmin } from "../controllers/products.controller.js";

const router = express.Router();

// buyer + seller
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// seller only
router.post("/", auth("seller"), addProduct);
router.put("/:id", auth("seller"), updateProduct);
router.delete("/:id", auth("seller"), deleteProduct);
router.get("/me/mine", auth("seller"), getSellerProducts);
router.delete("/admin/:id", auth("admin"), deleteProduct);
router.delete("/admin/:id", auth("admin"), deleteProductByAdmin);

export default router;
