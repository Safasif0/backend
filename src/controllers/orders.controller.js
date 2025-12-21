import Order from "../models/Order.js";

// CREATE ORDER (BUYER)
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      buyerUser: req.user.id,
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

// BUYER ORDERS
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

// ORDER DETAILS (BUYER / SELLER)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "title image price")
      .populate("buyerUser", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SELLER ORDERS
export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.seller": req.user.id,
    })
      .populate("items.product", "title image price")
      .populate("buyerUser", "name email phone")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS (SELLER)
export const updateOrderStatus = async (req, res) => {
  const allowed = ["pending", "confirmed", "shipped", "delivered"];
  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

// ADD REVIEW (BUYER)
export const addOrderReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      buyerUser: req.user.id,
      status: "delivered",
    });

    if (!order) {
      return res.status(404).json({ message: "Order not delivered yet" });
    }

    if (order.rating) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    order.rating = rating;
    order.comment = comment;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PRODUCT REVIEWS (PUBLIC)
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Order.find({
      "items.product": req.params.productId,
      status: "delivered",
      rating: { $exists: true },
    })
      .select("rating comment buyerUser createdAt")
      .populate("buyerUser", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SELLER REVIEWS =================
export const getSellerReviews = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await Order.find({
      status: "delivered",
      rating: { $exists: true },
      "items.seller": sellerId,
    })
      .select("rating comment buyerUser items createdAt")
      .populate("buyerUser", "name")
      .populate("items.product", "title");

    const reviews = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.seller?.toString() === sellerId.toString()) {
          reviews.push({
            rating: order.rating,
            comment: order.comment,
            buyer: order.buyerUser,
            product: item.product,
            createdAt: order.createdAt,
          });
        }
      });
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
