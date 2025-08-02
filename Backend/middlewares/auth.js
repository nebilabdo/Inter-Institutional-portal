const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

module.exports = (req, res, next) => {
  const token = req.cookies?.token; // read from cookie

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};
