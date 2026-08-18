const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get latest notifications
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
SELECT
a.appointment_id,
p.full_name AS patient_name,
d.full_name AS doctor_name,
a.appointment_date,
a.appointment_time,
a.status
FROM appointments a
JOIN patients p
ON a.patient_id = p.patient_id
JOIN doctors d
ON a.doctor_id = d.doctor_id
ORDER BY a.appointment_date DESC,
a.appointment_time DESC
LIMIT 10;
`);

    const notifications = result.rows.map((item) => ({
      id: item.appointment_id,
      message: `${item.patient_name} booked an appointment with ${item.doctor_name}`,
      time: `${item.appointment_date} ${item.appointment_time}`,
    }));

    res.json(notifications);
  } catch (err) {
  console.error(err);

  res.status(500).json({
    message: err.message,
  });
}
});

module.exports = router;