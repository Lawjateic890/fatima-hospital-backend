const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// ======================
// GET ALL DOCTORS
// ======================

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.doctor_id,
        d.full_name,
        d.specialization,
        d.email,
        d.phone,
        d.department_id,
        d.image,
        dep.department_name AS department
      FROM doctors d
      LEFT JOIN departments dep
      ON d.department_id = dep.department_id
      ORDER BY d.doctor_id ASC
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }
});


// ======================
// ADD DOCTOR
// ======================

router.post("/", async (req, res) => {

  try {

    const {
      full_name,
      specialization,
      email,
      phone,
      department_id,
      image,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO doctors
      (
      full_name,
      specialization,
      email,
      phone,
      department_id,
      image
      )

      VALUES($1,$2,$3,$4,$5,$6)

      RETURNING *
      `,
      [
        full_name,
        specialization,
        email,
        phone,
        department_id,
        image,
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }

});


// ======================
// UPDATE DOCTOR
// ======================

router.put("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      full_name,
      specialization,
      email,
      phone,
      department_id,
      image,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE doctors
      SET

      full_name=$1,
      specialization=$2,
      email=$3,
      phone=$4,
      department_id=$5,
      image=$6

      WHERE doctor_id=$7

      RETURNING *
      `,
      [
        full_name,
        specialization,
        email,
        phone,
        department_id,
        image,
        id,
      ]
    );

    if (result.rowCount === 0) {

      return res.status(404).json({
        message: "Doctor not found",
      });

    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }

});


// ======================
// DELETE DOCTOR
// ======================

router.delete("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM doctors
      WHERE doctor_id=$1
      RETURNING *
      `,
      [id]
    );

    if (result.rowCount === 0) {

      return res.status(404).json({
        message: "Doctor not found",
      });

    }

    res.json({
      message: "Doctor deleted successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }

});

module.exports = router;