import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { Eye, CreditCard, Filter, Search } from 'lucide-react';

const MyViolations = () => {
  const navigate = useNavigate();
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchViolations = async () => {
    setLoading(true);
    try {
      let url = '/violations?user_only=true';
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
      const res = await API.get(url);
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
  }, [statusFilter]);

  const filteredViolations = violations.filter(v => 
    (v.violation_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.vehicle_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.violation_type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>My Traffic Violations</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                Review registered traffic citations linked to your vehicles.
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '400px' }}>
              <Search size={18} style={{ color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by Violation ID or Vehicle No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0F172A',
                  border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none', fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Filter size={16} style={{ color: '#F59E0B' }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '8px 14px', borderRadius: '8px', background: '#0F172A',
                  border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', fontSize: '0.85rem', outline: 'none'
                }}
              >
                <option value="">All Statuses</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Approved">Approved / Action Required</option>
                <option value="Paid">Paid</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Violations Table */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#F59E0B' }}>Loading Citations...</div>
            ) : (
              <div className="responsive-table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Violation ID</th>
                      <th>Vehicle Number</th>
                      <th>Violation Type</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Fine Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredViolations.length > 0 ? (
                      filteredViolations.map((v) => (
                        <tr key={v.id}>
                          <td style={{ fontWeight: 700, color: '#FBBF24' }}>{v.violation_number}</td>
                          <td style={{ fontWeight: 600 }}>{v.vehicle_number}</td>
                          <td>{v.violation_type}</td>
                          <td>{v.violation_date ? v.violation_date.split('T')[0] : 'N/A'}</td>
                          <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{v.location}</td>
                          <td style={{ fontWeight: 700, color: '#F87171' }}>₹{v.fine_amount}</td>
                          <td>
                            <span className={`badge badge-${v.status ? v.status.toLowerCase().replace(' ', '-') : 'pending'}`}>
                              {v.status || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Link to={`/user/violation/${v.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                                <Eye size={14} /> View
                              </Link>

                              {v.status === 'Approved' && (
                                <button
                                  onClick={() => navigate(`/user/payment?violationId=${v.id}`)}
                                  className="btn-primary"
                                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                >
                                  <CreditCard size={14} /> Pay Fine
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                          No matching traffic violations found.
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
    </div>
  );
};

export default MyViolations;
