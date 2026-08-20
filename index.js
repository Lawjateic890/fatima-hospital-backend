require("dotenv").config();
console.log("__dirname =", __dirname);
const express = require("express");
const cors = require("cors");

const app = express();

console.log("Loading messages route...");

const appointmentRoutes = require("./routes/appointments");
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const departmentRoutes = require("./routes/departments");
const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
console.log("Messages route loaded successfully.");
const settingsRoutes = require("./routes/settings");
const notificationRoutes = require("./routes/notifications");

app.use(cors());
app.use(express.json());

app.use("/appointments", appointmentRoutes);
app.use("/messages", (req, res, next) => {
  console.log("➡ Request reached /messages");
  next();
});

app.use("/messages", messagesRoutes);
app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/departments", departmentRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/settings", settingsRoutes);
app.use("/notifications", notificationRoutes);
app.get("/", (req, res) => {
  res.send("THIS IS MY NEW SERVER");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});