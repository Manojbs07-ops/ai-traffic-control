import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  PlusCircle,
  FileCheck,
  FileX,
  Clock,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PoliceDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentViolations, setRecentViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoliceDashboard = async () => {
      try {
        const res = await API.get('/dashboard/police');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentViolations(res.data.recentViolations);
        }
      } catch (err) {
        console.error('Failed to load police dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoliceDashboard();
  }, []);

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          {/* Officer Welcome Header */}
          <div className="glass-panel" style={{ padding: '24px 30px', borderRadius: '16px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #F59E0B' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                LAW ENFORCEMENT DIVISION • {user?.station_name || 'Central Division'}
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '2px' }}>
                Officer {user?.full_name} ({user?.badge_number || 'POL-DESK'})
              </h1>
            </div>

            <button onClick={() => navigate('/police/report')} className="btn-primary" style={{ padding: '12px 20px' }}>
              <PlusCircle size={18} /> New Violation Report
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#F59E0B' }}>Loading Officer Metrics...</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>TOTAL REPORTED</span>
                    <ShieldAlert size={20} style={{ color: '#F59E0B' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalReported || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>System-wide violations</div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#60A5FA', fontWeight: 700 }}>PENDING REVIEW</span>
                    <Clock size={20} style={{ color: '#60A5FA' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60A5FA' }}>{stats?.pendingVerification || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#60A5FA', marginTop: '4px' }}>Queue for verification</div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>APPROVED FINES</span>
                    <FileCheck size={20} style={{ color: '#22C55E' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22C55E' }}>{stats?.approvedCount || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Enforced citation fines</div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>REJECTED REPORTS</span>
                    <FileX size={20} style={{ color: '#EF4444' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F87171' }}>{stats?.rejectedCount || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Invalid / dismissed</div>
                </div>

              </div>

              {/* Recent Violation Submissions Table */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Violation Submissions</h3>
                  <Link to="/police/pending" style={{ color: '#FBBF24', fontSize: '0.85rem', fontWeight: 600 }}>
                    Process Pending Review Queue →
                  </Link>
                </div>

                <div className="responsive-table-wrapper">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Violation ID</th>
                        <th>Vehicle Registration</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Date & Time</th>
                        <th>Fine Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentViolations.length > 0 ? (
                        recentViolations.map((v) => (
                          <tr key={v.id}>
                            <td style={{ fontWeight: 700, color: '#FBBF24' }}>{v.violation_number}</td>
                            <td style={{ fontWeight: 600 }}>{v.vehicle_number}</td>
                            <td>{v.violation_type}</td>
                            <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{v.location}</td>
                            <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                              {v.violation_date ? v.violation_date.split('T')[0] : ''} {v.violation_time}
                            </td>
                            <td style={{ fontWeight: 700 }}>₹{v.fine_amount}</td>
                            <td>
                              <span className={`badge badge-${v.status.toLowerCase().replace(' ', '-')}`}>
                                {v.status}
                              </span>
                            </td>
                            <td>
                              <Link to={`/police/violation/${v.id}`} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                                <Eye size={14} /> Inspect
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#94A3B8' }}>
                            No recent violations logged.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default PoliceDashboard;
