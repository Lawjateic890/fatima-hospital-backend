const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// =====================
// GET ALL DEPARTMENTS
// =====================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM departments
      ORDER BY department_name;
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }
});

// =====================
// CREATE DEPARTMENT
// =====================
router.post("/", async (req, res) => {

  try {

    const {
      department_name,
      description,
    } = req.body;

    const exists = await pool.query(
      `
      SELECT *
      FROM departments
      WHERE LOWER(department_name)=LOWER($1)
      `,
      [department_name]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({
        message: "Department already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO departments
      (
        department_name,
        description
      )
      VALUES ($1,$2)
      RETURNING *;
      `,
      [
        department_name,
        description,
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

// =====================
// UPDATE DEPARTMENT
// =====================
router.put("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      department_name,
      description,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE departments
      SET
        department_name=$1,
        description=$2
      WHERE department_id=$3
      RETURNING *;
      `,
      [
        department_name,
        description,
        id,
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }

});

// =====================
// DELETE DEPARTMENT
// =====================
router.delete("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    // Prevent deleting if doctors belong to this department
    const doctors = await pool.query(
      `
      SELECT *
      FROM doctors
      WHERE department_id=$1
      `,
      [id]
    );

    if (doctors.rows.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete department because doctors are assigned to it.",
      });
    }

    await pool.query(
      `
      DELETE FROM departments
      WHERE department_id=$1
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Department deleted successfully.",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }

});

module.exports = router;