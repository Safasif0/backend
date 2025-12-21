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
  getAllProducts,
} from "../controllers/products.controller.js";

import Order from "../models/Order.js"; // ✅ مهم

const router = express.Router();

/* ========= BUYER / PUBLIC ========= */

// ✅ لازم تبقى أول حاجة
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

/* ========= REVIEWS ========= */

// ⭐ GET reviews for product (من orders مش products)
router.get("/:id/reviews", async (req, res) => {
  try {
    const productId = req.params.id;

    const reviews = await Order.find({
      "items.product": productId,
      status: "delivered",
      rating: { $exists: true },
    })
      .select("rating comment buyerUser createdAt")
      .populate("buyerUser", "name");

    const numReviews = reviews.length;
    const averageRating =
      numReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
        : 0;

    res.json({
      reviews,
      numReviews,
      averageRating,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ========= COMMON ========= */

// ❗ لازم تبقى آخر route
router.get("/:id", getProductById);

export default router;
