import express from "express";
import cors from "cors";
import "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import flagRoutes from "./routes/flags.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Static
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/flags", flagRoutes);

export default app;
