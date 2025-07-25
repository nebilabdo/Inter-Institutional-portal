exports.sendApiUrl = (req, res) => {
  const { service_title, description, purpose } = req.body;

  let apiUrl = "http://localhost:0500/provider/real-data/default";

  if (service_title === "User Analytics") {
    apiUrl = "http://localhost:5000/provider/real-data/analytics";
  }

  res.json({ api_url: apiUrl });
};

exports.sendRealData = (req, res) => {
  const { id } = req.params;

  res.json({
    id,
    message: "This is your actual data from the provider",
  });
};
