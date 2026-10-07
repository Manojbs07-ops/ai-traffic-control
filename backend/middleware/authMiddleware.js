const jwt = require('jsonwebtoken');
const db = require('../config/db');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smart_traffic_system_super_secret_jwt_key_2026');

    // Fetch user from DB to ensure user is active and exists
    const [rows] = await db.query(
      'SELECT id, full_name, email, phone, address, role, status FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid token. User no longer exists.' });
    }

    const user = rows[0];
    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
    }

    // If user is police, fetch police_officer metadata
    if (user.role === 'police') {
      const [policeRows] = await db.query(
        'SELECT id as police_id, badge_number, station_name, rank, zone FROM police_officers WHERE user_id = ?',
        [user.id]
      );
      if (policeRows.length > 0) {
        user.police_id = policeRows[0].police_id;
        user.badge_number = policeRows[0].badge_number;
        user.station_name = policeRows[0].station_name;
        user.rank = policeRows[0].rank;
        user.zone = policeRows[0].zone;
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.', error: error.message });
  }
};

const isRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  isRole
};
