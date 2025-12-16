import Flag from "../models/Flag.js";
import Product from "../models/Product.js";

// =====================
//  BUYER → Create Flag
// =====================
export const createFlag = async (req, res) => {
  try {
    const { productId, reason } = req.body;

    if (!productId || !reason) {
      return res.status(400).json({ message: "productId and reason are required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // منع التكرار
    const exists = await Flag.findOne({
      product: productId,
      reporter: req.user.id,
    });

    if (exists) {
      return res.status(400).json({ message: "You already flagged this product" });
    }

    const flag = await Flag.create({
      product: productId,
      reporter: req.user.id,
      reason,
    });

    res.status(201).json(flag);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// ====================================
//  BUYER → Get my own flags
// ====================================
export const getMyFlags = async (req, res) => {
  try {
    const flags = await Flag.find({ reporter: req.user.id })
      .populate("product", "title price");

    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// ====================================
//  ADMIN → Get ALL flags
// ====================================
export const getAllFlags = async (req, res) => {
  try {
    const flags = await Flag.find()
      .populate("product", "title price")
      .populate("reporter", "name email role");

    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// ====================================
//  ADMIN → Delete a flag
// ====================================
export const deleteFlag = async (req, res) => {
  try {
    const flag = await Flag.findByIdAndDelete(req.params.id);
    if (!flag) return res.status(404).json({ message: "Flag not found" });

    res.json({ message: "Flag deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// ====================================
//  SELLER / ADMIN → Get flags for a product
// ====================================
export const getProductFlags = async (req, res) => {
  try {
    const flags = await Flag.find({ product: req.params.productId })
      .populate("reporter", "name email");

    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// =====================
//  ADMIN → Update flag status (approve / reject)
// =====================
export const updateFlagStatus = async (req, res) => {
  try {
    const { status } = req.body;   // "approved" OR "rejected"

    const flag = await Flag.findByIdAndUpdate(
      req.params.flagId,
      { status },
      { new: true }
    );

    if (!flag) {
      return res.status(404).json({ message: "Flag not found" });
    }

    res.json({ message: "Flag updated", flag });

  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};
