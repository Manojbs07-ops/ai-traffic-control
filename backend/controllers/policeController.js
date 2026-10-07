const db = require('../config/db');

// Get violations for police portal
exports.getPoliceViolations = async (req, res) => {
  try {
    const policeId = req.user.police_id;
    const { filter } = req.query; // 'pending', 'approved', 'rejected', 'my'

    let sql = `
      SELECT v.*, 
             u.full_name as owner_name, u.email as owner_email, u.phone as owner_phone,
             po.badge_number, po.station_name, p_user.full_name as police_name
      FROM violations v
      LEFT JOIN users u ON v.user_id = u.id
      LEFT JOIN police_officers po ON v.reported_by_police_id = po.id
      LEFT JOIN users p_user ON po.user_id = p_user.id
      WHERE 1=1
    `;
    const params = [];

    if (filter === 'pending') {
      sql += ` AND v.status = 'Pending Verification'`;
    } else if (filter === 'approved') {
      sql += ` AND (v.status = 'Approved' OR v.status = 'Paid')`;
    } else if (filter === 'rejected') {
      sql += ` AND v.status = 'Rejected'`;
    } else if (filter === 'my' && policeId) {
      sql += ` AND v.reported_by_police_id = ?`;
      params.push(policeId);
    }

    sql += ` ORDER BY v.created_at DESC`;

    const [rows] = await db.query(sql, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      violations: rows
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch police violations.', error: error.message });
  }
};

// Approve violation
exports.approveViolation = async (req, res) => {
  try {
    const { id } = req.params;
    const { fine_amount, description } = req.body;

    const [rows] = await db.query('SELECT * FROM violations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Violation not found.' });
    }

    const violation = rows[0];
    const newFine = fine_amount !== undefined ? parseFloat(fine_amount) : violation.fine_amount;
    const newDesc = description || violation.description;

    await db.query(
      `UPDATE violations 
       SET status = 'Approved', fine_amount = ?, description = ? 
       WHERE id = ?`,
      [newFine, newDesc, id]
    );

    // Notify user if linked
    if (violation.user_id) {
      await db.query(
        `INSERT INTO notifications (user_id, title, message)
         VALUES (?, 'Violation Approved & Fine Issued', ?)`,
        [
          violation.user_id,
          `Violation ${violation.violation_number} (${violation.violation_type}) has been approved by traffic police. Fine: ₹${newFine}.`
        ]
      );
    }

    return res.status(200).json({
      success: true,
      message: `Violation ${violation.violation_number} approved successfully!`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to approve violation.', error: error.message });
  }
};

// Reject violation
exports.rejectViolation = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;

    const [rows] = await db.query('SELECT * FROM violations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Violation not found.' });
    }

    const violation = rows[0];
    const reasonText = rejection_reason ? ` Reason: ${rejection_reason}` : '';

    await db.query(
      `UPDATE violations 
       SET status = 'Rejected', description = CONCAT(description, ?) 
       WHERE id = ?`,
      [reasonText, id]
    );

    return res.status(200).json({
      success: true,
      message: `Violation ${violation.violation_number} rejected.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reject violation.', error: error.message });
  }
};

// Get Police Officer Profile
exports.getPoliceProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      police: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile.', error: error.message });
  }
};
