import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* ================= BUYER creates order ================= */
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const order = await Order.create({
      product: product._id,
      buyer: req.user.id,
      seller: product.seller,
      quantity,
      price: product.price,
      total: product.price * quantity,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= SELLER gets his orders ================= */
export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate("product", "title image price")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET order details ================= */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      seller: req.user.id,
    })
      .populate("product", "title image price description")
      .populate("buyer", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE order status ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["pending", "confirmed", "shipped", "delivered"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      { status },
      { new: true }
    )
      .populate("product", "title")
      .populate("buyer", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
