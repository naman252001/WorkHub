const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes: check JWT token
const protect = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // Attach user to request
      return next();
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Manager-only routes
const managerOnly = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.toLowerCase() === "manager") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Managers only" });
};

module.exports = { protect, managerOnly };
