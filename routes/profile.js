const authMiddleware = require("../middleware/auth");
const express = require("express");
const router = express.Router();
//protected route

router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user });
});

module.exports = router;
