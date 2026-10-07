const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register Citizen User
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, address } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    }

    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email address is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password_hash, phone, address, role, status)
       VALUES (?, ?, ?, ?, ?, 'citizen', 'active')`,
      [full_name, email, password_hash, phone || '', address || '']
    );

    const userId = result.insertId;

    // Generate JWT Token
    const token = jwt.sign(
      { id: userId, email, role: 'citizen' },
      process.env.JWT_SECRET || 'smart_traffic_system_super_secret_jwt_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const user = {
      id: userId,
      full_name,
      email,
      phone: phone || '',
      address: address || '',
      role: 'citizen',
      status: 'active'
    };

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Traffic Reporter.',
      token,
      user
    });
  } catch (error) {
    console.error('[Register Error]', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = rows[0];

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Attach police metadata if officer
    let policeInfo = null;
    if (user.role === 'police') {
      const [policeRows] = await db.query(
        'SELECT id as police_id, badge_number, station_name, rank, zone FROM police_officers WHERE user_id = ?',
        [user.id]
      );
      if (policeRows.length > 0) {
        policeInfo = policeRows[0];
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'smart_traffic_system_super_secret_jwt_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const userPayload = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      status: user.status,
      ...(policeInfo || {})
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('[Login Error]', error);
    return res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

// Get Current User Profile
exports.getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.', error: error.message });
  }
};
