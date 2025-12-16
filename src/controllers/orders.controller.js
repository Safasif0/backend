import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // المنتج موجود؟
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      buyer: req.user.id,
      product: productId,
      quantity,
      totalPrice
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate("product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// GET ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product buyer");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// CANCEL ORDER
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // buyer بس هو اللي يقدر يلغي الأوردر
    if (order.buyer.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    if (order.status === "cancelled")
      return res.json({ message: "Order already cancelled" });

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // shipped - delivered
    const order = await Order.findById(req.params.id).populate("product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // only seller of the product
    if (order.product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};
