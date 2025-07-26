const db = require("../config/db");

// GET all requests
exports.getAllRequests = (req, res) => {
  db.query("SELECT * FROM requests", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// POST stop conversation
exports.stopConversation = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE requests SET conversationActive = FALSE WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Conversation stopped." });
    }
  );
};

// POST resume conversation
exports.resumeConversation = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE requests SET conversationActive = TRUE WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Conversation resumed." });
    }
  );
};

// POST save admin note
exports.saveAdminNote = (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  db.query(
    "UPDATE requests SET adminNote = ? WHERE id = ?",
    [note, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Admin note saved." });
    }
  );
};
