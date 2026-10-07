const db = require('../config/db');

// Process simulated payment
exports.processPayment = async (req, res) => {
  try {
    const { violation_id, payment_method, upi_id, card_number, bank_name } = req.body;
    const userId = req.user.id;

    if (!violation_id || !payment_method) {
      return res.status(400).json({ success: false, message: 'Violation ID and payment method are required.' });
    }

    const [rows] = await db.query('SELECT * FROM violations WHERE id = ?', [violation_id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Violation not found.' });
    }

    const violation = rows[0];

    if (violation.status === 'Paid') {
      return res.status(400).json({ success: false, message: 'This fine has already been paid.' });
    }

    // Generate payment & transaction reference numbers
    const payment_number = 'PAY-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
    const transaction_id = 'TXN' + Date.now() + Math.floor(1000 + Math.random() * 9000);

    // Insert payment record
    const [payResult] = await db.query(
      `INSERT INTO payments (payment_number, violation_id, user_id, amount, payment_method, transaction_id, status)
       VALUES (?, ?, ?, ?, ?, ?, 'PAID')`,
      [payment_number, violation_id, userId, violation.fine_amount, payment_method, transaction_id]
    );

    // Update violation status to 'Paid'
    await db.query(
      `UPDATE violations SET status = 'Paid' WHERE id = ?`,
      [violation_id]
    );

    // Add user notification
    await db.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES (?, 'Payment Successful', ?)`,
      [
        userId,
        `Payment of ₹${parseFloat(violation.fine_amount).toLocaleString('en-IN')} for violation ${violation.violation_number} was successfully processed. Transaction ID: ${transaction_id}`
      ]
    );

    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully! Digital receipt generated.',
      receipt: {
        payment_id: payResult.insertId,
        payment_number,
        transaction_id,
        amount: violation.fine_amount,
        payment_method,
        payment_date: new Date().toISOString(),
        violation_number: violation.violation_number,
        vehicle_number: violation.vehicle_number,
        violation_type: violation.violation_type,
        status: 'PAID'
      }
    });
  } catch (error) {
    console.error('[Payment Error]', error);
    return res.status(500).json({ success: false, message: 'Payment processing failed.', error: error.message });
  }
};

// Get User Payment History
exports.getPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    let sql = `
      SELECT p.*, v.violation_number, v.violation_type, v.vehicle_number, v.violation_date, v.location
      FROM payments p
      JOIN violations v ON p.violation_id = v.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'citizen') {
      sql += ` AND p.user_id = ?`;
      params.push(userId);
    }

    sql += ` ORDER BY p.payment_date DESC`;
    const [rows] = await db.query(sql, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      payments: rows
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payment history.', error: error.message });
  }
};
