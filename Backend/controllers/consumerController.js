const axios = require("axios");

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
