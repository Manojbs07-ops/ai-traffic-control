import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import ReceiptModal from '../../components/ReceiptModal';
import { History, Printer, CheckCircle, Search } from 'lucide-react';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get('/payments');
        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } catch (err) {
        console.error('Failed to fetch payment history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleOpenReceipt = (pay) => {
    setSelectedReceipt({
      payment_number: pay.payment_number,
      transaction_id: pay.transaction_id,
      payment_date: pay.payment_date,
      amount: pay.amount,
      payment_method: pay.payment_method,
      violation_number: pay.violation_number,
      vehicle_number: pay.vehicle_number,
      violation_type: pay.violation_type
    });
    setModalOpen(true);
  };

  const filteredPayments = payments.filter(p =>
    (p.payment_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.transaction_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.vehicle_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Payment & Transaction History</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Historical archive of fine payments processed under your citizen profile.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} style={{ color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by Payment No, Txn ID, Vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '6px', background: 'transparent', border: 'none',
                  color: '#FFF', outline: 'none', fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#F59E0B' }}>Loading Payment History...</div>
            ) : (
              <div className="responsive-table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Receipt No</th>
                      <th>Transaction ID</th>
                      <th>Violation ID</th>
                      <th>Vehicle</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Payment Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 700, color: '#FBBF24' }}>{p.payment_number}</td>
                          <td style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{p.transaction_id}</td>
                          <td>{p.violation_number}</td>
                          <td style={{ fontWeight: 600 }}>{p.vehicle_number}</td>
                          <td style={{ fontWeight: 700, color: '#22C55E' }}>₹{p.amount}</td>
                          <td><span className="badge badge-pending">{p.payment_method}</span></td>
                          <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                            {new Date(p.payment_date).toLocaleString()}
                          </td>
                          <td>
                            <button
                              onClick={() => handleOpenReceipt(p)}
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            >
                              <Printer size={14} /> Receipt
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                          No past transaction records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <ReceiptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        receipt={selectedReceipt}
      />
    </div>
  );
};

export default PaymentHistory;
