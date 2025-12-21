import Flag from "../models/Flag.js";
import Product from "../models/Product.js";

// ================= CREATE FLAG =================
export const createFlag = async (req, res) => {
  try {
    const flag = await Flag.create({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type || "general",
      product: req.body.product || null,
      createdBy: req.user.id,
    });

    res.status(201).json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN: GET ALL FLAGS =================
export const getAllFlags = async (req, res) => {
  try {
    const flags = await Flag.find()
      .populate("product", "title image seller")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SELLER: FLAGS ON MY PRODUCTS + GENERAL =================
export const getSellerFlags = async (req, res) => {
  try {
    const myProducts = await Product.find({
      seller: req.user.id,
    }).select("_id");

    const productIds = myProducts.map((p) => p._id);

    const flags = await Flag.find({
      $or: [
        { product: { $in: productIds } }, // flags على منتجاته
        { product: null },                // flags عامة
      ],
    })
      .populate("product", "title image")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE FLAG STATUS =================
export const updateFlagStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "reviewed", "rejected", "closed"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const flag = await Flag.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("product", "title image");

    if (!flag) {
      return res.status(404).json({ message: "Flag not found" });
    }

    res.json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
