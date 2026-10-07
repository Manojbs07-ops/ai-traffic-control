import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart2
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [typeBreakdown, setTypeBreakdown] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/dashboard/admin');
        if (res.data.success) {
          setStats(res.data.stats);
          setTypeBreakdown(res.data.typeBreakdown);
          setRecentActivity(res.data.recentActivity);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div className="glass-panel" style={{ padding: '24px 30px', borderRadius: '16px', marginBottom: '30px', borderLeft: '4px solid #F59E0B' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Central Administrative Command</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '4px' }}>
              System-wide metrics, officer personnel management, citation audit logs, and revenue monitoring.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#F59E0B' }}>Loading System Analytics...</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL CITIZENS</span>
                    <Users size={20} style={{ color: '#60A5FA' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalUsers || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Registered accounts</div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>POLICE OFFICERS</span>
                    <ShieldCheck size={20} style={{ color: '#F59E0B' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24' }}>{stats?.totalPolice || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Enforcement personnel</div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL VIOLATIONS</span>
                    <AlertTriangle size={20} style={{ color: '#F59E0B' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalViolations || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Recorded offences</div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>PENDING QUEUE</span>
                    <Clock size={20} style={{ color: '#60A5FA' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60A5FA' }}>{stats?.pendingViolations || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Awaiting review</div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#4ADE80', fontWeight: 700 }}>TOTAL REVENUE</span>
                    <Receipt size={20} style={{ color: '#22C55E' }} />
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ADE80' }}>
                    ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#4ADE80', marginTop: '4px' }}>Collected fine dues</div>
                </div>

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                
                {/* Recent Activity Table */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>System Incident Activity</h3>

                  <div className="responsive-table-wrapper">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Violation ID</th>
                          <th>Vehicle Reg</th>
                          <th>Offence</th>
                          <th>Fine</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentActivity.map((v) => (
                          <tr key={v.id}>
                            <td style={{ fontWeight: 700, color: '#FBBF24' }}>{v.violation_number}</td>
                            <td style={{ fontWeight: 600 }}>{v.vehicle_number}</td>
                            <td>{v.violation_type}</td>
                            <td style={{ fontWeight: 700 }}>₹{v.fine_amount}</td>
                            <td>
                              <span className={`badge badge-${v.status.toLowerCase().replace(' ', '-')}`}>
                                {v.status}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{v.violation_date?.split('T')[0]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Offence Breakdown Widget */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <BarChart2 size={20} style={{ color: '#F59E0B' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Offence Type Breakdown</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.keys(typeBreakdown).map((type) => {
                      const count = typeBreakdown[type];
                      const pct = Math.round((count / (stats?.totalViolations || 1)) * 100);
                      return (
                        <div key={type} style={{ background: '#162033', padding: '10px 14px', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                            <span>{type}</span>
                            <span style={{ color: '#FBBF24' }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: '#0F172A', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#F59E0B' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
