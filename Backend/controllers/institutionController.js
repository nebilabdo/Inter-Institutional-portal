const db = require("../config/db");

exports.getApprovedInstitutions = (req, res) => {
  db.query(
    "SELECT * FROM institutions WHERE approved = true",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      res.json(results);
    }
  );
};

exports.updateInstitutionInfo = (req, res) => {
  const id = req.params.id;
  const { name, address, contact_info } = req.body;

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
  }
  if (address !== undefined) {
    fields.push("address = ?");
    values.push(address);
  }
  if (contact_info !== undefined) {
    fields.push("contact_info = ?");
    values.push(contact_info);
  }

  if (fields.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided" });
  }

  values.push(id);

  const query = `UPDATE institutions SET ${fields.join(
    ", "
  )}, updated_at = NOW() WHERE id = ?`;

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Institution not found" });
    res.json({ message: "Institution info updated" });
  });
};
