import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import ReceiptModal from '../../components/ReceiptModal';
import { Receipt, Printer, Search, CheckCircle } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdminPayments = async () => {
      try {
        const res = await API.get('/admin/payments');
        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } catch (err) {
        console.error('Failed to fetch admin payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminPayments();
  }, []);

  const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const filteredPayments = payments.filter(p =>
    p.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.paid_by_name && p.paid_by_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Revenue & Payment Audit Log</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                Master treasury audit log for fine collections.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #22C55E' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>TOTAL COLLECTED REVENUE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ADE80' }}>
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} style={{ color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by Payment No, Txn, Vehicle, Citizen..."
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
              <div style={{ textAlign: 'center', padding: '40px', color: '#F59E0B' }}>Loading Payment Audit...</div>
            ) : (
              <div className="responsive-table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Receipt No</th>
                      <th>Transaction ID</th>
                      <th>Paid By Citizen</th>
                      <th>Vehicle</th>
                      <th>Violation ID</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700, color: '#FBBF24' }}>{p.payment_number}</td>
                        <td style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{p.transaction_id}</td>
                        <td style={{ fontWeight: 600 }}>{p.paid_by_name}</td>
                        <td style={{ fontWeight: 600 }}>{p.vehicle_number}</td>
                        <td>{p.violation_number}</td>
                        <td style={{ fontWeight: 700, color: '#22C55E' }}>₹{p.amount}</td>
                        <td><span className="badge badge-pending">{p.payment_method}</span></td>
                        <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                          {new Date(p.payment_date).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPayments;
