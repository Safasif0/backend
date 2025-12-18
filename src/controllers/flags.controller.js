import Flag from "../models/Flag.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// buyer يعمل flag
export const createFlag = async (req, res) => {
  try {
    const { targetType, targetId, reason } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({
        message: "targetType, targetId and reason are required",
      });
    }

    let sellerId;

    if (targetType === "product") {
      const product = await Product.findById(targetId);
      if (!product) return res.status(404).json({ message: "Product not found" });
      sellerId = product.seller;
    }

    if (targetType === "order") {
      const order = await Order.findById(targetId);
      if (!order) return res.status(404).json({ message: "Order not found" });
      sellerId = order.seller;
    }

    const flag = await Flag.create({
      targetType,
      targetId,
      targetModel: targetType === "product" ? "Product" : "Order",
      reason,
      flaggedBy: req.user.id,
      seller: sellerId,
    });

    res.status(201).json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// seller يشوف كل الفلاجز
export const getSellerFlags = async (req, res) => {
  try {
    const flags = await Flag.find({})
      .populate("flaggedBy", "email")
      .populate("seller", "email")
      .populate("targetId");

    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ accept = تغيير status فقط (من غير validation)
export const acceptFlag = async (req, res) => {
  try {
    const flag = await Flag.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true, runValidators: false }
    );

    if (!flag) {
      return res.status(404).json({ message: "Flag not found" });
    }

    res.json({ message: "Flag accepted", flag });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ reject = تغيير status فقط
export const rejectFlag = async (req, res) => {
  try {
    const flag = await Flag.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true, runValidators: false }
    );

    if (!flag) {
      return res.status(404).json({ message: "Flag not found" });
    }

    res.json({ message: "Flag rejected", flag });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ حذف الهدف (بعد القبول فقط)
export const deleteFlagTarget = async (req, res) => {
  try {
    const flag = await Flag.findById(req.params.id);

    if (!flag) {
      return res.status(404).json({ message: "Flag not found" });
    }

    if (flag.status !== "accepted") {
      return res.status(400).json({
        message: "You must accept the flag first",
      });
    }

    if (flag.targetType === "product") {
      await Product.findByIdAndDelete(flag.targetId);
    }

    if (flag.targetType === "order") {
      await Order.findByIdAndDelete(flag.targetId);
    }

    res.json({ message: "Target deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
