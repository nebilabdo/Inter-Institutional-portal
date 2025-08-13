const db = require("../config/db");
const bcrypt = require("bcryptjs");
const auditLog = require("../Utils/auditLogger");

exports.createInstitution = (req, res) => {
  const {
    name,
    type,
    contactPerson,
    email,
    phone,
    address,
    services,
    status,
    username,
    password,
    confirmPassword,
  } = req.body;

  if (
    !name ||
    !type ||
    !contactPerson ||
    !email ||
    !phone ||
    !address ||
    !password ||
    !confirmPassword
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const servicesJSON = Array.isArray(services)
    ? JSON.stringify(services)
    : null;

  // Step 1: Create institution without storing email/password
  const institutionQuery = `
    INSERT INTO institutions (
      name, type, contact_person, phone, address,
      username, services, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  const institutionValues = [
    name,
    type,
    contactPerson,
    phone,
    address,
    username,
    servicesJSON,
    status || "Active",
  ];

  db.query(institutionQuery, institutionValues, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Institution already exists." });
      }
      return res
        .status(500)
        .json({ message: "Failed to create institution.", error: err.message });
    }

    const institutionId = result.insertId;

    // Step 2: Create the user linked to the institution
    const userQuery = `
      INSERT INTO users (email, password_hash, role, institution_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;
    const userValues = [email, hashedPassword, "contactperson", institutionId];

    db.query(userQuery, userValues, (userErr, userResult) => {
      if (userErr) {
        console.error("Failed to insert user:", userErr);
        return res
          .status(500)
          .json({ message: "Institution created but user creation failed." });
      }

      res.status(201).json({
        message: "Institution created and user registered successfully.",
        institutionId,
        userId: userResult.insertId,
      });
    });
  });
};

exports.getUserStats = (req, res) => {
  const queryTotal = "SELECT COUNT(*) AS total FROM institutions";

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const formattedDate = oneMonthAgo
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const queryRecent = `
    SELECT COUNT(*) AS recent FROM institutions 
    WHERE created_at >= ?
  `;

  db.query(queryTotal, (err1, totalResult) => {
    if (err1) {
      console.error("Error fetching total users:", err1);
      return res.status(500).json({ message: "Failed to fetch user count" });
    }

    db.query(queryRecent, [formattedDate], (err2, recentResult) => {
      if (err2) {
        console.error("Error fetching monthly users:", err2);
        return res
          .status(500)
          .json({ message: "Failed to fetch monthly data" });
      }

      const totalUsers = totalResult[0].total;
      const monthlyChange = recentResult[0].recent;

      res.json({
        totalUsers,
        change:
          monthlyChange > 0 ? `+${monthlyChange} this Month` : "0 this Month",
      });
    });
  });
};

exports.registerInstitutionUser = (req, res) => {
  const { email, password, role, institution_name } = req.body;

  if (!email || !password || !role || !institution_name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["consumer", "provider"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  db.query(
    "SELECT id FROM institutions WHERE name = ?",
    [institution_name],
    (err, instRes) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (instRes.length === 0)
        return res.status(400).json({ message: "Institution not found" });

      const institution_id = instRes[0].id;
      const hashedPassword = bcrypt.hashSync(password, 8);

      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, userRes) => {
          if (err) return res.status(500).json({ message: "DB error" });
          if (userRes.length > 0)
            return res.status(400).json({ message: "Email already exists" });

          db.query(
            "INSERT INTO users (email, password_hash, role, institution_id) VALUES (?, ?, ?, ?)",
            [email, hashedPassword, role, institution_id],
            (err, result) => {
              if (err)
                return res
                  .status(500)
                  .json({ message: "Failed to create user" });
              res.status(201).json({
                message: `${role} registered`,
                userId: result.insertId,
              });
            }
          );
        }
      );
    }
  );
};

exports.approveInstitution = (req, res) => {
  const institutionId = req.params.id;
  db.query(
    "UPDATE institutions SET approved = true, updated_at = NOW() WHERE id = ?",
    [institutionId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Institution not found" });
      res.json({ message: "Institution approved" });
    }
  );
};

exports.deleteInstitution = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM institutions WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Institution not found" });
    res.json({ message: "Institution deleted successfully" });
  });
};

exports.getAllUsers = (req, res) => {
  db.query(
    "SELECT id, email, role, institution_id FROM users",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(results);
    }
  );
};

exports.getAllInstitutions = (req, res) => {
  db.query("SELECT * FROM institutions", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    const total = results.length;

    // Calculate how many were created in the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recent = results.filter((inst) => {
      const createdAt = new Date(inst.created_at);
      return createdAt >= oneMonthAgo;
    }).length;

    const change = `+${recent} this Month`;

    res.json({
      institutions: results,
      total,
      change,
    });
  });
};

exports.approveInstitution = (req, res) => {
  const institutionId = req.params.id;
  const userId = req.user.id;

  db.query(
    "UPDATE institutions SET approved = true, updated_at = NOW() WHERE id = ?",
    [institutionId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Institution not found" });

      auditLog(
        userId,
        "Approve Institution",
        `Institution ID: ${institutionId}`
      );

      res.json({ message: "Institution approved" });
    }
  );
};
