const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const createNotification = require("../utils/createNotification");

// ======================================
// GET ALL PATIENTS
// ======================================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM patients
      WHERE is_active = TRUE
      ORDER BY patient_id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching patients:", error);

    res.status(500).json({
      message: "Failed to fetch patients.",
    });
  }
});

// ======================================
// GET SINGLE PATIENT
// ======================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM patients
      WHERE patient_id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error.",
    });
  }
});

// ======================================
// ADD PATIENT
// ======================================
router.post("/", async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      gender,
      blood_group,
      disease,
      date_of_birth,
    } = req.body;

    if (
      !full_name ||
      !email ||
      !phone ||
      !gender ||
      !blood_group ||
      !disease ||
      !date_of_birth
    ) {
      return res.status(400).json({
        message: "Please fill all fields.",
      });
    }

    const existingPatient = await pool.query(
      `
      SELECT *
      FROM patients
      WHERE email = $1
      `,
      [email]
    );

    if (existingPatient.rows.length > 0) {
      return res.status(400).json({
        message: "A patient with this email already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO patients
      (
        full_name,
        email,
        phone,
        gender,
        blood_group,
        disease,
        date_of_birth
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        full_name,
        email,
        phone,
        gender,
        blood_group,
        disease,
        date_of_birth,
      ]
    );

    await createNotification(
      `👤 New patient registered: ${full_name}`
    );

    res.status(201).json({
      message: "Patient added successfully.",
      patient: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add patient.",
    });
  }
});

// ======================================
// UPDATE PATIENT
// ======================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      full_name,
      email,
      phone,
      gender,
      blood_group,
      disease,
      date_of_birth,
    } = req.body;

    if (
      !full_name ||
      !email ||
      !phone ||
      !gender ||
      !blood_group ||
      !disease ||
      !date_of_birth
    ) {
      return res.status(400).json({
        message: "Please fill all fields.",
      });
    }

    const existingPatient = await pool.query(
      `
      SELECT *
      FROM patients
      WHERE email = $1
      AND patient_id != $2
      `,
      [email, id]
    );

    if (existingPatient.rows.length > 0) {
      return res.status(400).json({
        message: "Another patient already uses this email.",
      });
    }

    const result = await pool.query(
      `
      UPDATE patients
      SET
        full_name = $1,
        email = $2,
        phone = $3,
        gender = $4,
        blood_group = $5,
        disease = $6,
        date_of_birth = $7
      WHERE patient_id = $8
      RETURNING *
      `,
      [
        full_name,
        email,
        phone,
        gender,
        blood_group,
        disease,
        date_of_birth,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found.",
      });
    }

    await createNotification(
      `✏️ Patient updated: ${full_name}`
    );

    res.json({
      message: "Patient updated successfully.",
      patient: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update patient.",
    });
  }
});

// ======================================
// ARCHIVE PATIENT
// ======================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE patients
      SET is_active = FALSE
      WHERE patient_id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found.",
      });
    }

    await createNotification(
      `🗑️ Patient archived: ${result.rows[0].full_name}`
    );

    res.json({
      message: "Patient archived successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to archive patient.",
    });
  }
});

// ======================================
// EXPORT ROUTER
// ======================================
module.exports = router;