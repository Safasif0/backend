import express from "express";
import { auth } from "../Middleware/auth.js";
import {
  getFlags,
  getFlagById,
  updateFlagStatus,
  deleteFlagTarget,
} from "../controllers/flags.controller.js";

const router = express.Router();

// seller routes
router.get("/", auth("seller"), getFlags);
router.get("/:id", auth("seller"), getFlagById);
router.put("/:id/status", auth("seller"), updateFlagStatus);
router.delete("/:id/target", auth("seller"), deleteFlagTarget);

export default router;
