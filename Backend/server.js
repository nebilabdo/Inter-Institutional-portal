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

const app = express();
app.use(logMiddleware);

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

const notificationsController = require("./controllers/notificationsController");

// Add this BEFORE your app.use("/api/notifications", ...) line:
app.get("/api/notifications/all", notificationsController.getAllNotifications);
app.get(
  "/api/notifications/unread",
  notificationsController.getUnreadNotifications
);

app.use(
  "/api/requests/:id/notifications",
  notificationsRoutes.requestNotificationsRouter
);

app.use("/api/notifications", notificationsRoutes.readRouter);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
