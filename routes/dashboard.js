const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {

    const patients = await pool.query(
      "SELECT COUNT(*) FROM patients"
    );

    const doctors = await pool.query(
      "SELECT COUNT(*) FROM doctors"
    );

    const departments = await pool.query(
      "SELECT COUNT(*) FROM departments"
    );

    const appointments = await pool.query(
      "SELECT COUNT(*) FROM appointments"
    );

    const recentPatients = await pool.query(`
      SELECT full_name, gender, disease
      FROM patients
      ORDER BY patient_id DESC
      LIMIT 5
    `);

    const recentAppointments = await pool.query(`
      SELECT appointment_date, appointment_time, status
      FROM appointments
      ORDER BY appointment_id DESC
      LIMIT 5
    `);

    const genderStats = await pool.query(`
      SELECT gender, COUNT(*) AS total
      FROM patients
      GROUP BY gender
    `);

    const appointmentStats = await pool.query(`
      SELECT status, COUNT(*) AS total
      FROM appointments
      GROUP BY status
    `);

    // Patients per month
    const patientsPerMonth = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'Mon') AS month,
        COUNT(*) AS total
      FROM patients
      GROUP BY
        TO_CHAR(created_at, 'Mon'),
        EXTRACT(MONTH FROM created_at)
      ORDER BY
        EXTRACT(MONTH FROM created_at)
    `);

    const appointmentsPerMonth = await pool.query(`
  SELECT
    TO_CHAR(appointment_date, 'Mon') AS month,
    COUNT(*) AS total
  FROM appointments
  GROUP BY
    TO_CHAR(appointment_date, 'Mon'),
    EXTRACT(MONTH FROM appointment_date)
  ORDER BY EXTRACT(MONTH FROM appointment_date);
`);

const newPatients = await pool.query(`
  SELECT COUNT(*) AS total
  FROM patients
  WHERE visit_count = 1
`);

const returningPatients = await pool.query(`
  SELECT COUNT(*) AS total
  FROM patients
  WHERE visit_count > 1
`);

console.log("appointmentsPerMonth:", appointmentsPerMonth.rows);
console.log("newPatients:", newPatients.rows);
console.log("returningPatients:", returningPatients.rows);


    res.json({
      patients: Number(patients.rows[0].count),
      doctors: Number(doctors.rows[0].count),
      departments: Number(departments.rows[0].count),
      appointments: Number(appointments.rows[0].count),
      newPatients: Number(newPatients.rows[0].total),
      returningPatients: Number(returningPatients.rows[0].total),

      recentPatients: recentPatients.rows,
      recentAppointments: recentAppointments.rows,

      genderStats: genderStats.rows,
      appointmentStats: appointmentStats.rows,
      patientsPerMonth: patientsPerMonth.rows,
      appointmentsPerMonth: appointmentsPerMonth.rows,

    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;