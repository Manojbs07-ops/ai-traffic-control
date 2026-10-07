import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Eye, Search, AlertTriangle } from 'lucide-react';

const AdminManageViolations = () => {
  const { showToast } = useAuth();

  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const res = await API.get('/violations');
      if (res.data.success) {
        setViolations(res.data.violations);
      }
    } catch (err) {
      console.error('Failed to fetch violations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this violation record permanently?')) return;
    try {
      const res = await API.delete(`/violations/${id}`);
      if (res.data.success) {
        showToast('Violation record deleted.', 'info');
        fetchViolations();
      }
    } catch (err) {
      showToast('Failed to delete violation.', 'error');
    }
  };

  const filteredViolations = violations.filter(v =>
    v.violation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.violation_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Master Traffic Violations Audit Log</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Central administrative control over all traffic citations recorded across the state.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} style={{ color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by Citation ID, Vehicle, Offence..."
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
              <div style={{ textAlign: 'center', padding: '40px', color: '#F59E0B' }}>Loading Citations Audit...</div>
            ) : (
              <div className="responsive-table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Violation ID</th>
                      <th>Vehicle</th>
                      <th>Offence</th>
                      <th>Reporting Officer</th>
                      <th>Fine</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredViolations.map((v) => (
                      <tr key={v.id}>
                        <td style={{ fontWeight: 700, color: '#FBBF24' }}>{v.violation_number}</td>
                        <td style={{ fontWeight: 600 }}>{v.vehicle_number}</td>
                        <td>{v.violation_type}</td>
                        <td style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                          {v.badge_number ? `Badge #${v.badge_number}` : 'System Admin'}
                        </td>
                        <td style={{ fontWeight: 700, color: '#FBBF24' }}>₹{v.fine_amount}</td>
                        <td>
                          <span className={`badge badge-${v.status.toLowerCase().replace(' ', '-')}`}>
                            {v.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(v.id)}
                            className="btn-danger"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
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

export default AdminManageViolations;
