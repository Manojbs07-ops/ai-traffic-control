import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  CreditCard,
  Bell,
  ArrowUpRight,
  Eye,
  ShieldAlert,
  PlusCircle
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentViolations, setRecentViolations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/dashboard/user');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentViolations(res.data.recentViolations);
          setNotifications(res.data.notifications);
        }
      } catch (err) {
        console.error('Failed to load user dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          {/* Header Banner */}
          <div className="glass-panel" style={{ padding: '24px 30px', borderRadius: '16px', marginBottom: '30px', borderLeft: '4px solid #F59E0B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back, {user?.full_name}! 👋</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '4px' }}>
                Citizen Enforcement Portal • Review citations, report road offenses, and clear pending fines online.
              </p>
            </div>
            <Link to="/user/report" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={16} /> Report a Violation
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#F59E0B' }}>Loading Dashboard Metrics...</div>
          ) : (
            <>
              {/* Stat Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>TOTAL VIOLATIONS</span>
                    <AlertTriangle size={20} style={{ color: '#F59E0B' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>{stats?.totalViolations || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Recorded offences</div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>PENDING REVIEW</span>
                    <Clock size={20} style={{ color: '#60A5FA' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60A5FA' }}>{stats?.pendingViolations || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Awaiting verification</div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>RESOLVED / PAID</span>
                    <CheckCircle size={20} style={{ color: '#4ADE80' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4ADE80' }}>{stats?.resolvedViolations || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Cleared citations</div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#F87171', fontWeight: 700 }}>UNPAID FINES DUE</span>
                    <CreditCard size={20} style={{ color: '#EF4444' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F87171' }}>
                    ₹{stats?.unpaidFines?.toLocaleString('en-IN') || 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#F87171', marginTop: '4px' }}>Outstanding dues</div>
                </div>

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                
                {/* Recent Violations Table */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Violations</h3>
                    <Link to="/user/violations" style={{ color: '#FBBF24', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View All <ArrowUpRight size={16} />
                    </Link>
                  </div>

                  <div className="responsive-table-wrapper">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Violation ID</th>
                          <th>Vehicle No</th>
                          <th>Type</th>
                          <th>Date</th>
                          <th>Fine</th>
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
                              <td>{v.violation_date ? v.violation_date.split('T')[0] : 'N/A'}</td>
                              <td style={{ fontWeight: 700 }}>₹{v.fine_amount}</td>
                              <td>
                                <span className={`badge badge-${v.status ? v.status.toLowerCase().replace(' ', '-') : 'pending'}`}>
                                  {v.status || 'Pending'}
                                </span>
                              </td>
                              <td>
                                <Link to={`/user/violation/${v.id}`} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                                  <Eye size={14} /> Details
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94A3B8' }}>
                              No traffic violations recorded under your account. Clean record!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notifications & System Updates Sidebar Card */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                    <Bell size={20} style={{ color: '#F59E0B' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>System Notifications</h3>
                  </div>

                  {notifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {notifications.map((n) => (
                        <div key={n.id} style={{ background: '#162033', padding: '12px 14px', borderRadius: '10px', borderLeft: '3px solid #F59E0B' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{n.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>{n.message}</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '6px' }}>
                            {new Date(n.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#64748B', padding: '20px 0', fontSize: '0.85rem' }}>
                      No new notifications.
                    </div>
                  )}
                </div>

              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
