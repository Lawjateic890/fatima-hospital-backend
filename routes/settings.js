const express = require("express");
const router = express.Router();
const pool = require("../config/db");
console.log("✅ SETTINGS ROUTE FILE LOADED");
// GET hospital settings
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM settings LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Settings not found."
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load settings."
    });
  }
});

// UPDATE hospital settings
router.put("/", async (req, res) => {
  try {
    const {
      hospital_name,
      email,
      phone,
      address,
      website,
      description,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE settings
      SET
        hospital_name = $1,
        email = $2,
        phone = $3,
        address = $4,
        website = $5,
        description = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE setting_id = 1
      RETURNING *
      `,
      [
        hospital_name,
        email,
        phone,
        address,
        website,
        description,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to update settings."
    });
  }
});

module.exports = router;