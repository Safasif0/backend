import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { title, description, price, images } = req.body;
    const product = await Product.create({
      title,
      description,
      price,
      images,
      seller: req.user.id
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  const products = await Product.find({ isActive: true }).populate("seller", "name");
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("seller", "name");
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user.id },
    req.body,
    { new: true }
  );
  if (!product) return res.status(404).json({ message: "Not found or not owner" });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    seller: req.user.id
  });
  if (!product) return res.status(404).json({ message: "Not found or not owner" });
  res.json({ message: "Deleted" });
};

export const getSellerProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user.id });
  res.json(products);
};

export const deleteProductByAdmin = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};
