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
  const {
    name,
    type,
    status,
    contact_person,
    email,
    phone,
    address,
    services,
  } = req.body;

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
  }
  if (type !== undefined) {
    fields.push("type = ?");
    values.push(type);
  }
  if (status !== undefined) {
    fields.push("status = ?");
    values.push(status);
  }
  if (contact_person !== undefined) {
    fields.push("contact_person = ?");
    values.push(contact_person);
  }
  if (email !== undefined) {
    fields.push("email = ?");
    values.push(email);
  }
  if (phone !== undefined) {
    fields.push("phone = ?");
    values.push(phone);
  }
  if (address !== undefined) {
    fields.push("address = ?");
    values.push(address);
  }
  if (services !== undefined) {
    fields.push("services = ?");
    values.push(JSON.stringify(services)); // assuming services is an array
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
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Institution not found" });
    res.json({ message: "Institution info updated" });
  });
};
