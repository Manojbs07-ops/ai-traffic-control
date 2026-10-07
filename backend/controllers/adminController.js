const bcrypt = require('bcryptjs');
const db = require('../config/db');

// --- USER MANAGEMENT ---

exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let sql = `SELECT id, full_name, email, phone, address, role, status, created_at FROM users WHERE 1=1`;
    const params = [];

    if (role) {
      sql += ` AND role = ?`;
      params.push(role);
    }

    if (search) {
      sql += ` AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY created_at DESC`;
    const [rows] = await db.query(sql, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      users: rows
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users.', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { full_name, email, password, phone, address, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password required.' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email address already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const userRole = role || 'citizen';

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password_hash, phone, address, role, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [full_name, email, hash, phone || '', address || '', userRole]
    );

    return res.status(201).json({
      success: true,
      message: 'User created successfully!',
      userId: result.insertId
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create user.', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, address, status, role, password } = req.body;

    const updates = [];
    const params = [];

    if (full_name) { updates.push('full_name = ?'); params.push(full_name); }
    if (email) { updates.push('email = ?'); params.push(email); }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
    if (address !== undefined) { updates.push('address = ?'); params.push(address); }
    if (status) { updates.push('status = ?'); params.push(status); }
    if (role) { updates.push('role = ?'); params.push(role); }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updates.push('password_hash = ?');
      params.push(hash);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No update parameters specified.' });
    }

    params.push(id);
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    return res.status(200).json({ success: true, message: 'User updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user.', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user.', error: error.message });
  }
};

// --- POLICE OFFICERS MANAGEMENT ---

exports.getAllPolice = async (req, res) => {
  try {
    const sql = `
      SELECT po.id as police_id, po.badge_number, po.station_name, po.rank, po.zone, po.created_at as joined_at,
             u.id as user_id, u.full_name, u.email, u.phone, u.status
      FROM police_officers po
      JOIN users u ON po.user_id = u.id
      ORDER BY po.id DESC
    `;
    const [rows] = await db.query(sql);

    return res.status(200).json({
      success: true,
      count: rows.length,
      police_officers: rows
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch police officers.', error: error.message });
  }
};

exports.createPoliceOfficer = async (req, res) => {
  try {
    const { full_name, email, password, phone, badge_number, station_name, rank, zone } = req.body;

    if (!full_name || !email || !password || !badge_number || !station_name) {
      return res.status(400).json({ success: false, message: 'Name, email, password, badge number, and station name are required.' });
    }

    // Check existing email
    const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Email address already exists.' });
    }

    // Check existing badge
    const [existingBadge] = await db.query('SELECT id FROM police_officers WHERE badge_number = ?', [badge_number]);
    if (existingBadge.length > 0) {
      return res.status(400).json({ success: false, message: 'Badge number is already assigned.' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [userRes] = await db.query(
      `INSERT INTO users (full_name, email, password_hash, phone, role, status)
       VALUES (?, ?, ?, ?, 'police', 'active')`,
      [full_name, email, hash, phone || '']
    );

    const userId = userRes.insertId;

    const [policeRes] = await db.query(
      `INSERT INTO police_officers (user_id, badge_number, station_name, rank, zone)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, badge_number, station_name, rank || 'Inspector', zone || 'Central Zone']
    );

    return res.status(201).json({
      success: true,
      message: 'Police Officer account created successfully!',
      police_id: policeRes.insertId
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create police officer.', error: error.message });
  }
};

exports.updatePoliceOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, badge_number, station_name, rank, zone, status } = req.body;

    const [policeRows] = await db.query('SELECT user_id FROM police_officers WHERE id = ?', [id]);
    if (policeRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Police officer record not found.' });
    }

    const userId = policeRows[0].user_id;

    // Update user info
    await db.query(
      `UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email), phone = COALESCE(?, phone), status = COALESCE(?, status) WHERE id = ?`,
      [full_name || null, email || null, phone || null, status || null, userId]
    );

    // Update police info
    await db.query(
      `UPDATE police_officers SET badge_number = COALESCE(?, badge_number), station_name = COALESCE(?, station_name), rank = COALESCE(?, rank), zone = COALESCE(?, zone) WHERE id = ?`,
      [badge_number || null, station_name || null, rank || null, zone || null, id]
    );

    return res.status(200).json({ success: true, message: 'Police officer details updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update police officer.', error: error.message });
  }
};

exports.deletePoliceOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const [policeRows] = await db.query('SELECT user_id FROM police_officers WHERE id = ?', [id]);
    if (policeRows.length > 0) {
      await db.query('DELETE FROM users WHERE id = ?', [policeRows[0].user_id]);
    }
    return res.status(200).json({ success: true, message: 'Police officer deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete police officer.', error: error.message });
  }
};

// --- SYSTEM PAYMENTS ---

exports.getAdminPayments = async (req, res) => {
  try {
    const sql = `
      SELECT p.*, v.violation_number, v.violation_type, v.vehicle_number, u.full_name as paid_by_name, u.email as paid_by_email
      FROM payments p
      JOIN violations v ON p.violation_id = v.id
      JOIN users u ON p.user_id = u.id
      ORDER BY p.payment_date DESC
    `;
    const [rows] = await db.query(sql);

    return res.status(200).json({
      success: true,
      count: rows.length,
      payments: rows
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payments.', error: error.message });
  }
};
