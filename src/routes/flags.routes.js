import express from "express";
import {
  createFlag,
  getMyFlags,
  getAllFlags,
  deleteFlag,
  getProductFlags,
  updateFlagStatus
} from "../controllers/flags.controller.js";

import { auth } from "../Middleware/auth.js";

const router = express.Router();

// BUYER → يعمل Flag
router.post("/", auth("buyer"), createFlag);

// BUYER → يشوف البلاغات اللي عملها
router.get("/me", auth("buyer"), getMyFlags);

// ADMIN → كل البلاغات
router.get("/admin/all", auth("admin"), getAllFlags);

// ADMIN → يحدث حالة البلاغ (approve / reject)
router.put("/admin/:flagId", auth("admin"), updateFlagStatus);

// ADMIN → يمسح بلاغ
router.delete("/:id", auth("admin"), deleteFlag);

// SELLER + ADMIN → يشوف البلاغات لمنتج معين
router.get("/product/:productId", auth(["seller", "admin"]), getProductFlags);

export default router;
