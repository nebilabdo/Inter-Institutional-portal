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

  db.query(
    "SELECT COUNT(*) AS count FROM users WHERE role = 'admin'",
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (results[0].count > 0) {
        return res.status(403).json({ message: "Admin already exists" });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      db.query(
        "INSERT INTO users (email, password_hash, role, institution_id) VALUES (?, ?, ?, NULL)",
        [email, hashedPassword, role],
        (err, result) => {
          if (err) {
            console.error("Insert error:", err);
            return res.status(500).json({
              message: "Failed to register admin",
              error: err.message,
            });
          }

          res
            .status(201)
            .json({ message: "Admin registered", userId: result.insertId });
        }
      );
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  console.log("Login attempt:", email);

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    if (results.length === 0) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    console.log("User found:", user.email, user.role);

    const valid = bcrypt.compareSync(password, user.password_hash);
    console.log("Password valid:", valid);

    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

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
      maxAge: 12 * 60 * 60, // 12 hours in seconds
    });

    res.setHeader("Set-Cookie", cookie);
    res.json({ message: "Login successful", token });
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
