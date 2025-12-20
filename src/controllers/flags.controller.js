import Flag from "../models/Flag.js";
import Product from "../models/Product.js";

// CREATE FLAG
export const createFlag = async (req, res) => {
  try {
    const flag = await Flag.create({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      product: req.body.product || null,
      createdBy: req.user.id,
    });

    res.status(201).json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: get all flags
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

// ✅ SELLER: flags على منتجاته
export const getSellerFlags = async (req, res) => {
  try {
    const myProducts = await Product.find({ seller: req.user.id }).select("_id");
    const ids = myProducts.map((p) => p._id);

    const flags = await Flag.find({ product: { $in: ids } })
      .populate("product", "title image")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS (seller/admin)
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

    res.json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
