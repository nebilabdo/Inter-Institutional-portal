require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logMiddleware = require("./middlewares/log");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const consumerRoutes = require("./routes/consumer");
const providerRoutes = require("./routes/provider");
const institutionRoutes = require("./routes/institution");
const requestRoutes = require("./routes/request");
const notificationsRoutes = require("./routes/notifications");
const activityRoutes = require("./routes/activity");

const app = express();
app.use(logMiddleware);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Backend API");
});
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/consumer", consumerRoutes);
app.use("/provider", providerRoutes);
app.use("/api/", institutionRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/activity", activityRoutes);

app.use("/api/notifications", notificationsRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
