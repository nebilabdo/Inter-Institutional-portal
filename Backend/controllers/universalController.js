const db = require("../config/db");

const submitDocument = (req, res) => {
  console.log("=== Incoming Request ===", req.body, req.files);

  if (!req.body.customer_name) {
    return res.status(400).json({ message: "Customer name is required" });
  }

  let institutionIds = [];
  if (req.body.institution_ids) {
    try {
      institutionIds =
        typeof req.body.institution_ids === "string"
          ? JSON.parse(req.body.institution_ids)
          : req.body.institution_ids;
      if (!Array.isArray(institutionIds)) institutionIds = [institutionIds];
    } catch (e) {
      console.warn("Failed to parse institution_ids");
      institutionIds = [req.body.institution_ids];
    }
  }

  if (!req.files?.["national_id"]?.[0]?.path) {
    return res.status(400).json({ message: "National ID file is required" });
  }

  const nationalIdPath = req.files["national_id"][0].path;
  const supportingDocs = req.files["supporting_docs"]
    ? req.files["supporting_docs"].map((f) => f.path)
    : [];

  const sql = `INSERT INTO universal 
      (user_id, customer_name, national_id_path, supporting_docs, institution_ids, status) 
      VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      req.user?.id || 1,
      req.body.customer_name,
      nationalIdPath,
      JSON.stringify(supportingDocs),
      JSON.stringify(institutionIds),
      "Pending",
    ],
    (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res
          .status(500)
          .json({ message: "Failed to submit", error: err.message });
      }

      res.status(201).json({
        success: true,
        message: "Submission successful",
        data: {
          id: result.insertId,
          nationalIdPath,
          supportingDocs,
        },
      });
    }
  );
};

module.exports = submitDocument;
