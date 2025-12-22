import Product from "../models/Product.js";
import Flag from "../models/Flag.js";

// ================= ADD PRODUCT =================
export const addProduct = async (req, res) => {
  try {
    const { title, price, description } = req.body;

    const images = req.files
      ? req.files.map((file) =>
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
        )
      : [];

    const product = await Product.create({
      title,
      price,
      description,
      deliveryTime: 3,
      seller: req.user.id,
      image: images, // Base64 strings
      isActive: true,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET MY PRODUCTS =================
export const getMyProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user.id });
  res.json(products);
};

// ================= GET PRODUCT BY ID =================
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "seller",
    "name email"
  );

  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  const updateData = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
  };

  if (req.files?.length) {
    updateData.image = req.files.map(
      (file) => `http://localhost:4000/uploads/${file.filename}`
    );
  }

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user.id },
    updateData,
    { new: true }
  );

  if (!product)
    return res.status(404).json({ message: "Not found or not owner" });

  res.json(product);
};

// ================= DELETE PRODUCT BY SELLER =================
export const deleteProductBySeller = async (req, res) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    seller: req.user.id,
  });

  if (!product)
    return res.status(404).json({ message: "Product not found" });

  await Flag.updateMany(
    { product: product._id },
    { status: "closed" }
  );

  res.json({ message: "Product deleted & flags closed" });
};

// ================= DELETE PRODUCT BY ADMIN =================
export const deleteProductByAdmin = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product)
    return res.status(404).json({ message: "Product not found" });

  await Flag.updateMany(
    { product: product._id },
    { status: "closed" }
  );

  res.json({ message: "Product deleted by admin" });
};

// ================= GET ALL PRODUCTS (BUYER) =================
export const getAllProducts = async (req, res) => {
  const products = await Product.find({ isActive: true })
    .populate("seller", "name");

  res.json(products);
};
