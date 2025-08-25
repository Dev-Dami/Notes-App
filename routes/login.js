const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Checking passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: existingUser._id, _id: existingUser._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

module.exports = router;
