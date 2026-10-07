const db = require('../config/db');

// Citizen Dashboard Statistics
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.full_name;

    const [violations] = await db.query(
      `SELECT * FROM violations 
       WHERE user_id = ? OR vehicle_number IN (SELECT vehicle_number FROM vehicles WHERE owner_name LIKE ?)
       ORDER BY created_at DESC`,
      [userId, `%${userName}%`]
    );

    const totalViolations = violations.length;
    const pendingViolations = violations.filter(v => v.status === 'Pending Verification').length;
    const approvedViolations = violations.filter(v => v.status === 'Approved').length;
    const resolvedViolations = violations.filter(v => v.status === 'Paid' || v.status === 'Rejected').length;

    const unpaidFines = violations
      .filter(v => v.status === 'Approved' || v.status === 'Pending Verification')
      .reduce((sum, v) => sum + parseFloat(v.fine_amount || 0), 0);

    const paidFines = violations
      .filter(v => v.status === 'Paid')
      .reduce((sum, v) => sum + parseFloat(v.fine_amount || 0), 0);

    const [notifications] = await db.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalViolations,
        pendingViolations,
        approvedViolations,
        resolvedViolations,
        unpaidFines,
        paidFines
      },
      recentViolations: violations.slice(0, 5),
      notifications
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load user dashboard.', error: error.message });
  }
};

// Police Dashboard Statistics
exports.getPoliceDashboard = async (req, res) => {
  try {
    const policeId = req.user.police_id;

    // Fetch total violations in system & for police
    const [allVios] = await db.query('SELECT * FROM violations');

    const totalReported = allVios.length;
    const pendingVerification = allVios.filter(v => v.status === 'Pending Verification').length;
    const approvedCount = allVios.filter(v => v.status === 'Approved' || v.status === 'Paid').length;
    const rejectedCount = allVios.filter(v => v.status === 'Rejected').length;

    let myReportedCount = 0;
    if (policeId) {
      myReportedCount = allVios.filter(v => v.reported_by_police_id === policeId).length;
    }

    const [recentVios] = await db.query(
      `SELECT v.*, u.full_name as owner_name 
       FROM violations v 
       LEFT JOIN users u ON v.user_id = u.id 
       ORDER BY v.created_at DESC LIMIT 6`
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalReported,
        pendingVerification,
        approvedCount,
        rejectedCount,
        myReportedCount
      },
      recentViolations: recentVios
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load police dashboard.', error: error.message });
  }
};

// Admin Dashboard Statistics
exports.getAdminDashboard = async (req, res) => {
  try {
    const [usersCount] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'citizen'");
    const [policeCount] = await db.query("SELECT COUNT(*) as count FROM police_officers");
    const [violations] = await db.query("SELECT * FROM violations");
    const [payments] = await db.query("SELECT SUM(amount) as total_revenue FROM payments WHERE status = 'PAID'");

    const totalUsers = usersCount[0]?.count || 0;
    const totalPolice = policeCount[0]?.count || 0;
    const totalViolations = violations.length;
    const pendingViolations = violations.filter(v => v.status === 'Pending Verification').length;
    const resolvedViolations = violations.filter(v => v.status === 'Paid' || v.status === 'Rejected').length;
    const totalRevenue = payments[0]?.total_revenue || 0;

    // Group violations by violation_type for chart/analytics breakdown
    const typeBreakdown = {};
    violations.forEach(v => {
      typeBreakdown[v.violation_type] = (typeBreakdown[v.violation_type] || 0) + 1;
    });

    const [recentActivity] = await db.query(
      `SELECT v.*, u.full_name as owner_name 
       FROM violations v 
       LEFT JOIN users u ON v.user_id = u.id 
       ORDER BY v.created_at DESC LIMIT 5`
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPolice,
        totalViolations,
        pendingViolations,
        resolvedViolations,
        totalRevenue: parseFloat(totalRevenue)
      },
      typeBreakdown,
      recentActivity
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load admin dashboard.', error: error.message });
  }
};
