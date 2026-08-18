const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { sendEmail } = require("../services/emailService");
const appointmentTemplate = require("../templates/appointmentEmail");

// =====================
// GET ALL APPOINTMENTS
// =====================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.appointment_id,
        a.patient_id,
        a.doctor_id,
        p.full_name AS patient_name,
        d.full_name AS doctor_name,
        d.specialization,
        a.appointment_date,
        a.appointment_time,
       a.status,
a.symptoms,
a.created_at
      FROM appointments a
      JOIN patients p
        ON a.patient_id = p.patient_id
      JOIN doctors d
        ON a.doctor_id = d.doctor_id
      ORDER BY
        a.appointment_date DESC,
        a.appointment_time ASC;
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
// CREATE APPOINTMENT
// =====================
router.post("/", async (req, res) => {
  try {

    const {
  patient_name,
  email,
  phone,
  date_of_birth,
  gender,
  doctor_id,
  appointment_date,
  appointment_time,
  status,
  symptoms,
} = req.body;

    // Check doctor availability
    const existing = await pool.query(
      `
      SELECT *
      FROM appointments
      WHERE doctor_id=$1
      AND appointment_date=$2
      AND appointment_time=$3
      `,
      [
        doctor_id,
        appointment_date,
        appointment_time,
      ]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Doctor already has an appointment at this time.",
      });
    }

    // Check if patient already exists
    let patient = await pool.query(
      `
      SELECT *
      FROM patients
      WHERE email=$1
      `,
      [email]
    );

    let patient_id;

    if (patient.rows.length > 0) {

      patient_id = patient.rows[0].patient_id;

    } else {

      const newPatient = await pool.query(
        `
        INSERT INTO patients
(
  full_name,
  email,
  phone,
  gender,
  age
)
VALUES ($1,$2,$3,$4,$5)
RETURNING patient_id;
        `,
        [
  patient_name,
  email,
  phone,
  gender,
  age,
]
      );

      patient_id = newPatient.rows[0].patient_id;
    }

    // Create appointment
    const result = await pool.query(
      `
      INSERT INTO appointments
(
  patient_id,
  doctor_id,
  appointment_date,
  appointment_time,
  status,
  symptoms
)
VALUES ($1,$2,$3,$4,$5,$6)
RETURNING *;
      `,
      [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status,
        symptoms
      ]
    );

    // Get patient and doctor information
    const info = await pool.query(
      `
      SELECT
      p.full_name AS patient_name,
      p.email AS patient_email,
      d.full_name AS doctor_name,
      d.email AS doctor_email,
      d.specialization
      FROM patients p
      JOIN doctors d
      ON d.doctor_id=$1
      WHERE p.patient_id=$2
      `,
      [doctor_id, patient_id]
    );

    const data = info.rows[0];
    
    console.log("Patient Email:", data.patient_email);
console.log("Doctor Email:", data.doctor_email);
    console.log(data);


    await sendEmail(
      data.patient_email,
      "Appointment Confirmation - Fatima Hospital",
      appointmentTemplate({
        patientName: data.patient_name,
        doctorName: data.doctor_name,
        specialization: data.specialization,
        appointmentDate: appointment_date,
        appointmentTime: appointment_time,
      })
    );

    if (data.doctor_email) {
  await sendEmail(
    data.doctor_email,
    "New Appointment Scheduled",
    `
      <h2>Fatima Hospital</h2>

      <p>Hello <b>${data.doctor_name}</b>,</p>

      <p>A new appointment has been booked.</p>

      <hr>

      <p><b>Patient:</b> ${data.patient_name}</p>
      <p><b>Date:</b> ${appointment_date}</p>
      <p><b>Time:</b> ${appointment_time}</p>
      <p><b>Symptoms:</b> ${symptoms}</p>

      <hr>

      <p>Please be available at the scheduled time.</p>
    `
  );
} else {
  console.log(`Doctor ${data.doctor_name} has no email address.`);
}

    res.status(201).json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }
});

// =====================
// UPDATE APPOINTMENT
// =====================
router.put("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      status,
    } = req.body;

    // Ignore current appointment while checking clashes
    const existing = await pool.query(
      `
      SELECT *
      FROM appointments
      WHERE doctor_id=$1
      AND appointment_date=$2
      AND appointment_time=$3
      AND appointment_id<>$4
      `,
      [
        doctor_id,
        appointment_date,
        appointment_time,
        id,
      ]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message:
          "This doctor already has an appointment at the selected time.",
      });
    }

    const result = await pool.query(
      `
      UPDATE appointments
      SET
        patient_id=$1,
        doctor_id=$2,
        appointment_date=$3,
        appointment_time=$4,
        status=$5
      WHERE appointment_id=$6
      RETURNING *;
      `,
      [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status,
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
// DELETE APPOINTMENT
// =====================
router.delete("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM appointments WHERE appointment_id=$1",
      [id]
    );

    res.json({
      success: true,
      message: "Appointment deleted successfully.",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }

});

module.exports = router;