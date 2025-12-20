import Order from "../models/Order.js";

// ================= CREATE ORDER (BUYER) =================
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      buyerUser: req.user.id, // مهم جدًا
      buyer: req.body.buyer,
      items: req.body.items,
      totalPrice: req.body.totalPrice,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= BUYER ORDERS =================
export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerUser: req.user.id })
      .populate("items.product", "title image price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SELLER ORDERS =================
export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "items.seller": req.user.id })
      .populate("items.product", "title image price")
      .populate("buyerUser", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ORDER DETAILS =================
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "title image price")
      .populate("buyerUser", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE STATUS (SELLER) =================
export const updateOrderStatus = async (req, res) => {
  try {
    const allowed = ["pending", "confirmed", "shipped", "delivered"];

    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
