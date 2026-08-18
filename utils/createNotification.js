const pool = require("../config/db");

async function createNotification(message) {
  try {
    await pool.query(
      `
      INSERT INTO notifications (message)
      VALUES ($1)
      `,
      [message]
    );

    console.log("✅ Notification Created:", message);
  } catch (err) {
    console.error("❌ Notification Error:", err.message);
  }
}

module.exports = createNotification;