import dotenv from "dotenv";
dotenv.config();
import express from "express";
import app from "./src/app.js";

app.use("/uploads", express.static("uploads"));  // مهم جداً

const PORT = process.env.PORT || 4000;

// Important: لازم يكون هنا مش في app.js
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
