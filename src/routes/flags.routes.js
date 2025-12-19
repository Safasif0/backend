import express from "express";
import {
  createFlag,
  getAllFlags,
  updateFlagStatus,
} from "../controllers/flags.controller.js";
import { auth } from "../Middleware/auth.js";

const router = express.Router();

// أي user عامل login
router.post("/", auth(), createFlag);

// Admin يشوف flags
router.get("/", auth("admin"), getAllFlags);

// Admin يغير status
router.put("/:id", auth("admin"), updateFlagStatus);

export default router;
