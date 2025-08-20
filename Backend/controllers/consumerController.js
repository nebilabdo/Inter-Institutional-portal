const axios = require("axios");
const db = require("../config/db"); // adjust the path if needed

exports.fetchApiUrl = async (req, res) => {
  try {
    const { service_title, description, purpose } = req.body;

    const providerResponse = await axios.post(
      "http://localhost:5000/provider/get-api-url",
      { service_title, description, purpose }
    );

    const apiUrl = providerResponse.data.api_url;

    const finalResponse = await axios.get(apiUrl);

    res.json({
      requested_service: service_title,
      api_url: apiUrl,
      data: finalResponse.data,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get data", details: err.message });
  }
};

// profileController.js
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      institutionName,
      contactPerson,
      phone,
      email,
      address,
      type,
      status,
      services,
    } = req.body;

    // Get the user's institution_id
    const [userResults] = await db
      .promise()
      .query("SELECT institution_id FROM users WHERE id = ?", [userId]);

    if (userResults.length === 0)
      return res.status(404).json({ message: "User not found" });

    const institutionId = userResults[0].institution_id;

    if (!institutionId)
      return res
        .status(400)
        .json({ message: "User does not belong to any institution" });

    // Update institution (without email)
    const updateInstitutionQuery = `
      UPDATE institutions SET
        name = COALESCE(?, name),
        contact_person = COALESCE(?, contact_person),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        type = COALESCE(?, type),
        status = COALESCE(?, status),
        services = COALESCE(?, services)
      WHERE id = ?
    `;
    await db
      .promise()
      .query(updateInstitutionQuery, [
        institutionName,
        contactPerson,
        phone,
        address,
        type,
        status,
        services ? JSON.stringify(services) : null,
        institutionId,
      ]);

    // Update user email (so login works with new email)
    if (email) {
      await db
        .promise()
        .query("UPDATE users SET email = ? WHERE id = ?", [email, userId]);
    }

    // Return updated info
    const [updatedInst] = await db
      .promise()
      .query("SELECT * FROM institutions WHERE id = ?", [institutionId]);

    const [user] = await db
      .promise()
      .query("SELECT id, email, role, institution_id FROM users WHERE id = ?", [
        userId,
      ]);

    res.json({
      message: "Profile updated successfully",
      user: user[0],
      institution: updatedInst[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};
