import Flag from "../models/Flag.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ================= CREATE FLAG (buyer) =================
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
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      sellerId = product.seller;
    }

    if (targetType === "order") {
      const order = await Order.findById(targetId);
      if (!order)
        return res.status(404).json({ message: "Order not found" });
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

// ================= GET SELLER FLAGS =================
export const getFlags = async (req, res) => {
  try {
    const flags = await Flag.find({ seller: req.user.id })
      .populate("flaggedBy", "email")
      .populate("seller", "email")
      .populate("targetId");

    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET FLAG BY ID =================
export const getFlagById = async (req, res) => {
  try {
    const flag = await Flag.findById(req.params.id)
      .populate("flaggedBy", "email")
      .populate("seller", "email")
      .populate("targetId");

    if (!flag) return res.status(404).json({ message: "Flag not found" });

    res.json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE FLAG STATUS =================
export const updateFlagStatus = async (req, res) => {
  try {
    const { status } = req.body; // accepted | rejected

    const flag = await Flag.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      { status },
      { new: true }
    );

    if (!flag)
      return res.status(404).json({ message: "Flag not found" });

    res.json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE TARGET (AFTER ACCEPT) =================
export const deleteFlagTarget = async (req, res) => {
  try {
    const flag = await Flag.findById(req.params.id);
    if (!flag) return res.status(404).json({ message: "Flag not found" });

    flag.status = "accepted";
    await flag.save();

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
