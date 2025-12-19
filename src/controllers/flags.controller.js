import Flag from "../models/Flag.js";

// CREATE FLAG
export const createFlag = async (req, res) => {
  try {
    const flag = await Flag.create({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      product: req.body.product || null,
      createdBy: req.user.id, // ✅ صح (مش _id)
    });

    res.status(201).json(flag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL FLAGS (Admin)
export const getAllFlags = async (req, res) => {
  try {
    const flags = await Flag.find()
      .populate("product", "title")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS
export const updateFlagStatus = async (req, res) => {
  try {
    const flag = await Flag.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
