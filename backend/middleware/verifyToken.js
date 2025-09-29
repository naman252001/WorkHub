// middleware/verifyToken.js
const jwt = require("jsonwebtoken");
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ msg: "User not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = verifyToken;
