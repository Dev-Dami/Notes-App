const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Access denied");

  // Split 'Bearer <token>'
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Access denied");

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret",
    (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).send("Invalid token");
      }
      // Make sure the user ID is properly set
      req.user = { id: decoded._id || decoded.id };
      next();
    }
  );
}

module.exports = authMiddleware;
