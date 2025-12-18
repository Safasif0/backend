import express from "express";
import { auth } from "../Middleware/auth.js";
import {
  createFlag,
  getSellerFlags,
  acceptFlag,
  rejectFlag,
  deleteFlagTarget,
} from "../controllers/flags.controller.js";

const router = express.Router();

// buyer
router.post("/", auth("buyer"), createFlag);

// seller
router.get("/seller", auth("seller"), getSellerFlags);
router.put("/:id/accept", auth("seller"), acceptFlag);
router.put("/:id/reject", auth("seller"), rejectFlag);
router.delete("/:id/target", auth("seller"), deleteFlagTarget);

export default router;
