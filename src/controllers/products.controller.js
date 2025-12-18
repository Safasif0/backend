import Product from "../models/Product.js";

// ================= ADD PRODUCT =================
export const addProduct = async (req, res) => {
  try {
    const { title, price, description } = req.body;

    const newProduct = await Product.create({
      title,
      price,
      description,
      seller: req.user.id,
      image: req.file
        ? `http://localhost:4000/uploads/${req.file.filename}`
        : null,
    });

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET MY PRODUCTS =================
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET PRODUCT BY ID =================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    return res.status(400).json({ message: "Invalid product id" });
  }
};

// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Not found or not owner" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE PRODUCT (SELLER) =================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Not found or not owner" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE PRODUCT (ADMIN) =================
export const deleteProductByAdmin = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
