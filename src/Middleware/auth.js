import jwt from "jsonwebtoken";

export const auth = (roles = []) => {
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // نثبت شكل req.user
      req.user = {
        id: decoded.id || decoded._id,
        role: decoded.role,
      };

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Not allowed" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
