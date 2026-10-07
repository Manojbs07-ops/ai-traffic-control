const db = require('../config/db');

// Create new violation report
exports.createViolation = async (req, res) => {
  try {
    const {
      vehicle_number,
      vehicle_type,
      violation_type,
      location,
      violation_date,
      violation_time,
      description,
      fine_amount
    } = req.body;

    if (!vehicle_number || !vehicle_type || !violation_type || !location || !violation_date || !violation_time || !fine_amount) {
      return res.status(400).json({ success: false, message: 'All required violation fields must be provided.' });
    }

    // Process file upload if available
    let evidence_image = null;
    if (req.file) {
      evidence_image = `/uploads/${req.file.filename}`;
    }

    // Auto generate unique violation_number VIO-YYYY-XXXX
    const violation_number = 'VIO-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    // Auto match vehicle owner user_id if vehicle exists in vehicles table
    const [vehicleMatch] = await db.query(
      'SELECT id, owner_name FROM vehicles WHERE vehicle_number = ?',
      [vehicle_number.toUpperCase().trim()]
    );

    let matchedUserId = null;
    if (vehicleMatch.length > 0) {
      const ownerName = vehicleMatch[0].owner_name;
      const [userMatch] = await db.query('SELECT id FROM users WHERE full_name LIKE ?', [`%${ownerName}%`]);
      if (userMatch.length > 0) {
        matchedUserId = userMatch[0].id;
      }
    }

    // Status logic: If reported by police, set default to 'Pending Verification' or 'Approved'
    const status = req.user.role === 'police' ? 'Pending Verification' : 'Pending Verification';
    const reported_by_police_id = req.user.police_id || null;

    const [result] = await db.query(
      `INSERT INTO violations (
        violation_number, vehicle_number, vehicle_type, violation_type, location,
        violation_date, violation_time, description, fine_amount, status,
        evidence_image, reported_by_police_id, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        violation_number,
        vehicle_number.toUpperCase().trim(),
        vehicle_type,
        violation_type,
        location,
        violation_date,
        violation_time,
        description || '',
        parseFloat(fine_amount),
        status,
        evidence_image,
        reported_by_police_id,
        matchedUserId
      ]
    );

    // If user matched, send notification
    if (matchedUserId) {
      await db.query(
        `INSERT INTO notifications (user_id, title, message)
         VALUES (?, 'New Traffic Violation Recorded', ?)`,
        [
          matchedUserId,
          `A new traffic violation (${violation_type}) with fine ₹${fine_amount} has been logged for vehicle ${vehicle_number.toUpperCase()}.`
        ]
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Traffic violation report created successfully!',
      violation_id: result.insertId,
      violation_number
    });
  } catch (error) {
    console.error('[Create Violation Error]', error);
    return res.status(500).json({ success: false, message: 'Failed to create violation report.', error: error.message });
  }
};

// Get list of violations (Role-tailored & filterable)
exports.getAllViolations = async (req, res) => {
  try {
    const { status, vehicle_number, violation_type, user_only } = req.query;
    let sql = `
      SELECT v.*, 
             u.full_name as owner_name, u.email as owner_email,
             po.badge_number, po.station_name, p_user.full_name as police_name,
             pay.payment_number, pay.transaction_id, pay.payment_date, pay.payment_method
      FROM violations v
      LEFT JOIN users u ON v.user_id = u.id
      LEFT JOIN police_officers po ON v.reported_by_police_id = po.id
      LEFT JOIN users p_user ON po.user_id = p_user.id
      LEFT JOIN payments pay ON pay.violation_id = v.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by role
    if (req.user.role === 'citizen' || user_only === 'true') {
      sql += ` AND (v.user_id = ? OR v.vehicle_number IN (SELECT vehicle_number FROM vehicles WHERE owner_name LIKE ?))`;
      params.push(req.user.id, `%${req.user.full_name}%`);
    }

    if (status) {
      sql += ` AND v.status = ?`;
      params.push(status);
    }

    if (vehicle_number) {
      sql += ` AND v.vehicle_number LIKE ?`;
      params.push(`%${vehicle_number}%`);
    }

    if (violation_type) {
      sql += ` AND v.violation_type = ?`;
      params.push(violation_type);
    }

    sql += ` ORDER BY v.created_at DESC`;

    const [rows] = await db.query(sql, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      violations: rows
    });
  } catch (error) {
    console.error('[Get Violations Error]', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch violations.', error: error.message });
  }
};

// Get violation by ID
exports.getViolationById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT v.*, 
             u.full_name as owner_name, u.email as owner_email, u.phone as owner_phone,
             po.badge_number, po.station_name, po.rank, p_user.full_name as police_name,
             pay.id as payment_id, pay.payment_number, pay.transaction_id, pay.payment_date, pay.payment_method, pay.amount as paid_amount
      FROM violations v
      LEFT JOIN users u ON v.user_id = u.id
      LEFT JOIN police_officers po ON v.reported_by_police_id = po.id
      LEFT JOIN users p_user ON po.user_id = p_user.id
      LEFT JOIN payments pay ON pay.violation_id = v.id
      WHERE v.id = ? OR v.violation_number = ?
    `;

    const [rows] = await db.query(sql, [id, id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Violation record not found.' });
    }

    return res.status(200).json({
      success: true,
      violation: rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch violation details.', error: error.message });
  }
};

// Update violation record
exports.updateViolation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, fine_amount, description, location, violation_type } = req.body;

    const [existing] = await db.query('SELECT * FROM violations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Violation not found.' });
    }

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (fine_amount !== undefined) {
      updates.push('fine_amount = ?');
      params.push(parseFloat(fine_amount));
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (location !== undefined) {
      updates.push('location = ?');
      params.push(location);
    }
    if (violation_type !== undefined) {
      updates.push('violation_type = ?');
      params.push(violation_type);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No update parameters provided.' });
    }

    params.push(id);
    await db.query(`UPDATE violations SET ${updates.join(', ')} WHERE id = ?`, params);

    return res.status(200).json({
      success: true,
      message: 'Violation record updated successfully!'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update violation.', error: error.message });
  }
};

// Delete violation record (Admin only)
exports.deleteViolation = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM violations WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Violation record deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete violation.', error: error.message });
  }
};
