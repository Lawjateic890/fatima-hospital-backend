const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const { sendEmail } = require("../services/emailService");

// Send Contact Message
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    // Save to PostgreSQL
    await pool.query(
      `INSERT INTO contact_messages
      (full_name, email, phone, message)
      VALUES ($1,$2,$3,$4)`,
      [fullName, email, phone, message]
    );

    // Send email to hospital
    await sendEmail(
      "fatimahospitalofficial.pk@gmail.com",
      "New Contact Form Submission",
      `
      <h2>New Contact Message</h2>

      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>

      <p><strong>Message:</strong></p>
      <p>${message}</p>
      `
    );

    res.json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;