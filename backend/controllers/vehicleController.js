const db = require('../config/db');

// Search vehicle by registration number
exports.searchVehicle = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;

    if (!vehicleNumber) {
      return res.status(400).json({ success: false, message: 'Please specify a vehicle registration number.' });
    }

    const cleanNum = vehicleNumber.trim().toUpperCase();

    // 1. Check vehicle database
    const [vehicleRows] = await db.query('SELECT * FROM vehicles WHERE vehicle_number = ?', [cleanNum]);

    // 2. Fetch associated violations
    const [violationRows] = await db.query(
      `SELECT v.*, pay.payment_number, pay.transaction_id, pay.payment_date 
       FROM violations v 
       LEFT JOIN payments pay ON pay.violation_id = v.id
       WHERE v.vehicle_number = ?
       ORDER BY v.violation_date DESC`,
      [cleanNum]
    );

    const vehicleInfo = vehicleRows.length > 0 ? vehicleRows[0] : {
      vehicle_number: cleanNum,
      owner_name: violationRows.length > 0 && violationRows[0].owner_name ? violationRows[0].owner_name : 'Registered Vehicle',
      vehicle_type: violationRows.length > 0 ? violationRows[0].vehicle_type : 'Vehicle',
      model: 'N/A',
      color: 'N/A',
      registration_date: 'N/A'
    };

    // Calculate totals
    const totalViolations = violationRows.length;
    const unpaidFines = violationRows
      .filter(v => v.status === 'Approved' || v.status === 'Pending Verification')
      .reduce((sum, v) => sum + parseFloat(v.fine_amount || 0), 0);

    const paidFines = violationRows
      .filter(v => v.status === 'Paid')
      .reduce((sum, v) => sum + parseFloat(v.fine_amount || 0), 0);

    return res.status(200).json({
      success: true,
      vehicle: vehicleInfo,
      summary: {
        totalViolations,
        unpaidFines,
        paidFines,
        pendingCount: violationRows.filter(v => v.status === 'Pending Verification').length,
        approvedCount: violationRows.filter(v => v.status === 'Approved').length,
        paidCount: violationRows.filter(v => v.status === 'Paid').length
      },
      violations: violationRows
    });
  } catch (error) {
    console.error('[Vehicle Search Error]', error);
    return res.status(500).json({ success: false, message: 'Failed to search vehicle records.', error: error.message });
  }
};
