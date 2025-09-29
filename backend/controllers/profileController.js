const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update Profile (only editable fields)
const updateProfile = async (req, res) => {
  try {
    const { dateOfBirth, phone, department, employeeId, JobProfile } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update only editable fields
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.phone = phone || user.phone;
    user.department = department || user.department;
    user.employeeId = employeeId || user.employeeId;
    user.JobProfile = JobProfile || user.JobProfile

    await user.save();
    res.json({ msg: "Profile updated", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Upload Profile Picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ msg: "Profile picture updated", profilePicture: user.profilePicture });
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Change Password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ msg: "Old and new passwords are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Skip password check for OAuth users (no password set)
    if (!user.password) {
      return res.status(400).json({ msg: "Password change not allowed for OAuth users" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Old password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Upload Avatar (predefined image)
const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ msg: "No avatar provided" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.profilePicture = avatar; // direct avatar path (/avatars/avatarX.png)
    await user.save();

    res.json({ msg: "Avatar updated successfully", profilePicture: user.profilePicture });
  } catch (err) {
    console.error("Error updating avatar:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  updatePassword,
  updateAvatar,
};