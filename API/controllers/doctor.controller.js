const { validationResult } = require("express-validator");
const pool = require("../config/db");

//get dashboard stats
const getDashboardStats = async (req, res) =>{
  try {
    const [stats] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) AS total_patients,
        (SELECT COUNT(*) FROM appointments) AS total_appointments,
        (SELECT COUNT(*) FROM appointments WHERE status = 'completed') AS completed_appointments,
        (SELECT COUNT(*) FROM appointments WHERE status = 'cancelled') AS cancelled_appointments,
        (SELECT SUM(fee) FROM appointments) AS revenue,
        (SELECT COUNT(*) FROM users WHERE created_at > DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)) AS patients_growth,
        (SELECT COUNT(*) FROM appointments WHERE appointment_date > DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)) AS appointments_growth,
        (SELECT SUM(fee) FROM appointments WHERE appointment_date > DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)) AS revenue_growth
    `);
    return stats[0]
  } catch (error) {
    console.error("get dashboard stats error", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}


const getAllDoctors = async (req, res) => {
  try {
    const [doctors] = await pool.query(
      `SELECT 
        d.id, d.specialization AS specialty, d.experience, d.fee,
        d.rating, d.reviews_count AS reviews,
        d.availability, d.about, d.services, d.languages,
        d.education, d.certifications, d.location,
        d.available_slots AS availableSlots,
        u.name, u.email,
        u.image_url AS image
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.is_approved = 1`
    );
    // Ensure available_slots is always an array
    const normalizedDoctors = doctors.map(doc => {
      let available_slots = [];
      if (doc.availableSlots) {
        try {
          available_slots = JSON.parse(doc.availableSlots);
          if (!Array.isArray(available_slots)) available_slots = [];
        } catch {
          available_slots = [];
        }
      }
      return { ...doc, available_slots };
    });
    res.json(normalizedDoctors);
  } catch (error) {
    console.error("get doctors error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const [doctors] = await pool.query(
      `SELECT
            d.id, d.specialization AS specialty, d.experience, d.fee,
            COALESCE(d.rating, 0) AS rating, COALESCE(d.reviews_count, 0) AS reviews,
            COALESCE(d.availability, '') AS availability, COALESCE(d.about, '') AS about, COALESCE(d.services, '') AS services, COALESCE(d.languages, '') AS languages,
            COALESCE(d.education, '') AS education, COALESCE(d.certifications, '') AS certifications, COALESCE(d.location, '') AS location,
            COALESCE(d.available_slots, '') AS availableSlots,
            u.name, u.email,
            u.image_url AS image
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        WHERE d.id = ? AND d.is_approved = 1`,
      [req.params.id]
    );

    if (doctors.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Ensure available_slots is always an array
    let doc = doctors[0];
    let available_slots = [];
    if (doc.availableSlots) {
      try {
        available_slots = JSON.parse(doc.availableSlots);
        if (!Array.isArray(available_slots)) available_slots = [];
      } catch {
        available_slots = [];
      }
    }
    doc.available_slots = available_slots;
    res.json(doc);
  } catch (error) {
    console.error("get doctor by id error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { specialization, experience, fee } = req.body;

    const [doctors] = await pool.query(
      `SELECT * FROM doctors WHERE id = ? AND user_id = ?`,
      [req.user.doctorId, req.user.id]
    );
    if (doctors.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await pool.query(
      `UPDATE doctors 
        SET specialization = ?, experience = ?, fee = ?
        WHERE id = ?`,
      [specialization, experience, fee, req.user.doctorId]
    );
    res.json({ message: "Doctor profile updated successfully" });
  } catch (error) {
    console.error("update doctor profile error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const [appointments] = await pool.query(
      `SELECT 
        a.id, a.appointment_date, a.appointment_time, a.status, a.payment_status,
        u.name as patient_name, u.email as patient_email
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        WHERE a.doctor_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [req.user.doctorId]
    );
    console.log(appointments)
    res.json(appointments);
  } catch (error) {
    console.error("get doctor appointments error", error);
    res.status(500).json({ message: "Intestrnal Server Error" });
  }
};

//get earning
const getDoctorEarnings = async (req, res) => {
  try {
    if (!req.user?.doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    const [earnings] = await pool.query(
      `SELECT 
        a.id, a.appointment_date, a.appointment_time, a.status, a.payment_status,
        u.name as patient_name, u.email as patient_email, 
        p.amount as payment_amount
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [req.user.doctorId]
    );

    res.json(earnings);
  } catch (error) {
    console.error("get doctor earnings error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;

    if (!["confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [appointments] = await pool.query(
      `SELECT * FROM appointments WHERE id = ? AND doctor_id = ?`,
      [appointmentId, req.user.doctorId]
    );

    if (appointments.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await pool.query("UPDATE appointments SET status = ? WHERE id = ?", [
      status,
      appointmentId,
    ]);

    res.json({ message: "Appointment status updated successfully" });
  } catch (error) {
    console.error("update appointment status error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDashboardStats,
  getDoctorEarnings
};
