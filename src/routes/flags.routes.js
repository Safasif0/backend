import express from "express";
import { auth } from "../Middleware/auth.js";
import {
  createFlag,
  getAllFlags,
  getSellerFlags,
  updateFlagStatus,
} from "../controllers/flags.controller.js";

const router = express.Router();

// Buyer create flag
router.post("/", auth(), createFlag);

// Admin see all flags
router.get("/", auth("admin"), getAllFlags);

// Seller see flags on his products + general
router.get("/seller", auth("seller"), getSellerFlags);

// Seller أو Admin يغير status
router.put("/:id", auth(["seller", "admin"]), updateFlagStatus);

export default router;
