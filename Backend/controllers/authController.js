const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { serialize } = require("cookie");

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const isProd = process.env.NODE_ENV === "production";

exports.register = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admin registration allowed here" });
  }

  // Check if admin exists
  db.query(
    "SELECT COUNT(*) AS count FROM users WHERE role = 'admin'",
    (err, results) => {
      if (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results[0].count > 0) {
        return res.status(403).json({ message: "Admin already exists" });
      }

      // Hash password
      bcrypt.hash(password, 8, (err, hashedPassword) => {
        if (err) {
          console.error("Hash error:", err);
          return res.status(500).json({ message: "Server error" });
        }

        // Insert admin
        db.query(
          "INSERT INTO users (email, password_hash, role, institution_id) VALUES (?, ?, ?, NULL)",
          [email, hashedPassword, role],
          (err, insertResult) => {
            if (err) {
              console.error("Insert error:", err);
              return res.status(500).json({ message: "Server error" });
            }

            res
              .status(201)
              .json({
                message: "Admin registered",
                userId: insertResult.insertId,
              });
          }
        );
      });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = results[0];

    bcrypt.compare(password, user.password_hash, (err, valid) => {
      if (err) {
        console.error("Compare error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (!valid)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          institution_id: user.institution_id,
        },
        JWT_SECRET,
        { expiresIn: "12h" }
      );

      const cookie = serialize("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 12 * 60 * 60,
      });

      res.setHeader("Set-Cookie", cookie);
      res.json({ message: "Login successful", token });
    });
  });
};

exports.logout = (req, res) => {
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  res.setHeader("Set-Cookie", cookie);

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");

  res.status(200).json({ message: "Logged out successfully" });
};
