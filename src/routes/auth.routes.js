import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register); // body: {name,email,password,role}
router.post("/login", login);       // body: {email,password}

export default router;
