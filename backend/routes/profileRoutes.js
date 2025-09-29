const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getProfile, updateProfile, uploadProfilePicture, updatePassword, updateAvatar } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Profile routes
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.post("/picture", protect, upload.single("profilePicture"), uploadProfilePicture);
router.put("/password", protect, updatePassword);
router.put("/avatar", protect, updateAvatar);

module.exports = router;