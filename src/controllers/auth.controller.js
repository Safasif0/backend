import jwt from "jsonwebtoken";
import User from "../models/user.js";

const genToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // Validate and sanitize role
    if (role && !["buyer", "seller", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // If role is missing, undefined, null, or invalid → force default
    role = role || "buyer";  // or just omit it entirely (default will apply)

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already used" });
    }

    // Create user – password hashing happens in pre-save hook
    const user = await User.create({ name, email, password, role });

    const token = genToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name,
        email,
        role: user.role
      }
    });
  } catch (err) {
    // Improved error response for validation issues
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = genToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};
