const db = require("../config/db");
const bcrypt = require("bcryptjs");
const auditLog = require("../Utils/auditLogger");

exports.createInstitution = (req, res) => {
  const {
    name,
    focal_person_name,
    focal_person_email,
    focal_person_phone,
    address,
    contact_info,
    organization_type,
  } = req.body;

  if (
    !name ||
    !focal_person_name ||
    !focal_person_email ||
    !focal_person_phone ||
    !address ||
    !contact_info ||
    !organization_type
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
  INSERT INTO institutions (
    name, focal_person_name, focal_person_email, focal_person_phone,
    organization_type, address, contact_info, approved, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, false, NOW(), NOW())
`;

  const values = [
    name,
    focal_person_name,
    focal_person_email,
    focal_person_phone,
    organization_type,
    address,
    contact_info,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("DB INSERT ERROR:", err);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "Institution already exists. Duplicate entry not allowed.",
        });
      }

      return res.status(500).json({
        message: "Failed to create institution. Please try again later.",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Institution created successfully.",
      institutionId: result.insertId,
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
    res.json(results);
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
