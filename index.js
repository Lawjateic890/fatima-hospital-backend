require("dotenv").config();

console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME
});
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
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

const pool = require("./config/db");

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Database Error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});