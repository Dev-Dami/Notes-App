const authMiddleware = require("../middleware/auth");
const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
//protected route

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.memberSince) {
      user.memberSince = user.createdAt || user._id.getTimestamp();
      await user.save();
    }

    // Sanitize response
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ user: safeUser });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // check if email is already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // update user fields
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    // return updated user without password
    const updatedUser = await User.findById(userId).select("-password");
    res.json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Change password
router.put("/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find the user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // verifing current password -part lazy to
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

module.exports = router;
