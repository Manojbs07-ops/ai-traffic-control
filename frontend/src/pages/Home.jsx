import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import {
  ShieldAlert,
  Search,
  CheckCircle,
  Clock,
  Activity,
  Award,
  FileText,
  CreditCard,
  BarChart3,
  Car,
  ShieldCheck,
  ChevronRight,
  Target,
  ArrowRight
} from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Vehicle Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Counter numbers state
  const [counters, setCounters] = useState({
    users: 0,
    violations: 0,
    fines: 0,
    revenue: 0.0,
    reliability: 0.0
  });

  useEffect(() => {
    // Animated counter trigger
    const duration = 2000; // ms
    const steps = 50;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        users: Math.floor(12850 * progress),
        violations: Math.floor(8945 * progress),
        fines: Math.floor(6420 * progress),
        revenue: (3.2 * progress).toFixed(1),
        reliability: (98.7 * progress).toFixed(1)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleVehicleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const res = await API.get(`/vehicles/search/${encodeURIComponent(searchQuery.trim())}`);
      if (res.data.success) {
        setSearchResults(res.data);
        setSearchModalOpen(true);
      }
    } catch (err) {
      console.error('Vehicle search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div style={{ background: '#0B1220', color: '#FFFFFF', minHeight: '100vh' }}>
      
      {/* ==================== HERO SECTION ==================== */}
      <section style={{ position: 'relative', padding: '60px 24px 80px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Hero Left Content */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#FBBF24',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '20px'
            }}>
              <ShieldAlert size={16} /> Official Traffic Management Portal
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px' }}>
              Smart Traffic <br />
              <span style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Violation Reporting
              </span> System
            </h1>

            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#94A3B8', marginBottom: '12px' }}>
              "Building safer roads through smarter digital reporting."
            </p>

            <p style={{ fontSize: '1rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '32px', maxWidth: '540px' }}>
              A secure and efficient platform for reporting traffic violations, tracking offences, managing fines, and maintaining digital records across enforcement jurisdictions.
            </p>

            {/* Hero CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
              <Link
                to={user ? (user.role === 'police' ? '/police/report' : user.role === 'admin' ? '/admin/violations' : '/user/report') : '/login'}
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                REPORT VIOLATION <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => {
                  const el = document.getElementById('search-widget');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-secondary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                CHECK VIOLATION <Search size={18} />
              </button>
            </div>

            {/* Quick Vehicle Search Form */}
            <div id="search-widget" className="glass-panel" style={{ padding: '16px', borderRadius: '16px', maxWidth: '480px' }}>
              <form onSubmit={handleVehicleSearch} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Car size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    placeholder="Enter Vehicle Number (e.g. TN 01 AB 1234)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '10px',
                      background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={searchLoading} style={{ padding: '12px 20px' }}>
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </form>
            </div>
          </div>

          {/* Hero Right side: CSS Pure Road Animation & Traffic Dashboard Preview */}
          <div className="hero-road-container">
            {/* Perspective Road Graphic */}
            <div className="road-perspective">
              <div className="lane-lines"></div>
            </div>
            
            <div className="city-silhouette"></div>

            {/* Glowing Traffic Signal */}
            <div className="traffic-light-graphic">
              <div className="light-bulb light-red"></div>
              <div className="light-bulb light-yellow"></div>
              <div className="light-bulb light-green"></div>
            </div>

            {/* Floating Traffic Monitoring Card */}
            <div className="dashboard-preview-card floating-element">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} style={{ color: '#F59E0B' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em' }}>TRAFFIC MONITORING</span>
                </div>
                <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>
                  Live System
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#162033', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Violations Today</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FBBF24' }}>124</div>
                </div>
                <div style={{ background: '#162033', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Pending</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60A5FA' }}>32</div>
                </div>
                <div style={{ background: '#162033', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Resolved</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ADE80' }}>92</div>
                </div>
                <div style={{ background: '#162033', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>System Status</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22C55E', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                    <CheckCircle size={14} /> Operational
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                Central Command Radar • Real-time Data Sync
              </div>
            </div>
          </div>
        </div>

        {/* OUR MISSION CARD */}
        <div className="glass-panel" style={{ marginTop: '50px', padding: '24px 32px', borderRadius: '16px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Target size={32} style={{ color: '#FBBF24', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                OUR MISSION
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                "To make traffic enforcement transparent, efficient and digitally accessible."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOME FEATURES SECTION ==================== */}
      <section id="features" style={{ padding: '80px 24px', background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              KEY CAPABILITIES
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '8px' }}>
              Everything You Need for Smarter Traffic Management
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: FileText,
                title: 'Report Violations',
                desc: 'Authorized police officers can quickly report infractions with vehicle details, geo-location, and image evidence uploads.',
                link: '/police/report'
              },
              {
                icon: Clock,
                title: 'Track Violation',
                desc: 'Citizens can track real-time verification and status updates of their reported traffic violations online.',
                link: '/user/violations'
              },
              {
                icon: CreditCard,
                title: 'Fine Management',
                desc: 'Streamlined online fine payment portal supporting demo UPI, credit/debit cards, and instant digital receipt download.',
                link: '/user/payment'
              },
              {
                icon: Search,
                title: 'Vehicle Search',
                desc: 'Instant vehicle history search tool to inspect pending fines, registration history, and violation records by license plate.',
                link: '/#search-widget'
              },
              {
                icon: ShieldCheck,
                title: 'Police Dashboard',
                desc: 'Dedicated portal for law enforcement to review reports, verify image evidence, assign fines, or reject invalid claims.',
                link: '/police/dashboard'
              },
              {
                icon: BarChart3,
                title: 'Analytics & Insights',
                desc: 'Comprehensive administrative dashboard featuring violation trends, revenue breakdown, and officer audit logs.',
                link: '/admin/dashboard'
              }
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '30px',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = '#F59E0B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px'
                    }}>
                      <IconComp size={24} style={{ color: '#FBBF24' }} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{card.title}</h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                      {card.desc}
                    </p>
                  </div>
                  <Link to={card.link} style={{
                    color: '#FBBF24',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    Learn More <ChevronRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== STATISTICS COUNTERS ==================== */}
      <section style={{ padding: '70px 24px', background: '#162033', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FBBF24' }}>
                {counters.users.toLocaleString()}+
              </div>
              <div style={{ fontSize: '0.95rem', color: '#CBD5E1', fontWeight: 600, marginTop: '4px' }}>
                Registered Users
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FBBF24' }}>
                {counters.violations.toLocaleString()}+
              </div>
              <div style={{ fontSize: '0.95rem', color: '#CBD5E1', fontWeight: 600, marginTop: '4px' }}>
                Violations Reported
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FBBF24' }}>
                {counters.fines.toLocaleString()}+
              </div>
              <div style={{ fontSize: '0.95rem', color: '#CBD5E1', fontWeight: 600, marginTop: '4px' }}>
                Fines Issued
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FBBF24' }}>
                ₹{counters.revenue} Cr+
              </div>
              <div style={{ fontSize: '0.95rem', color: '#CBD5E1', fontWeight: 600, marginTop: '4px' }}>
                Revenue Collected
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#22C55E' }}>
                {counters.reliability}%
              </div>
              <div style={{ fontSize: '0.95rem', color: '#CBD5E1', fontWeight: 600, marginTop: '4px' }}>
                System Reliability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            WORKFLOW PROCESS
          </span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '8px' }}>How The System Works</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          position: 'relative'
        }}>
          {[
            { num: '01', title: 'REPORT', desc: 'Police officer logs violation details and uploads photo evidence.' },
            { num: '02', title: 'VERIFY', desc: 'System verifies vehicle registration and matches registered owner.' },
            { num: '03', title: 'ASSIGN FINE', desc: 'Officer approves offence and sets standard fine penalty.' },
            { num: '04', title: 'RESOLVE', desc: 'Citizen pays fine online and receives official digital receipt.' }
          ].map((step, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '30px',
                borderRadius: '16px',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#F59E0B',
                opacity: 0.9,
                marginBottom: '8px'
              }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#FFFFFF' }}>{step.title}</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== VEHICLE SEARCH RESULT MODAL ==================== */}
      <Modal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} title="Vehicle Search Result">
        {searchResults && (
          <div>
            <div style={{ background: '#162033', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>VEHICLE NUMBER</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FBBF24' }}>{searchResults.vehicle?.vehicle_number}</div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Owner: {searchResults.vehicle?.owner_name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>TOTAL FINES DUE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EF4444' }}>
                  ₹{searchResults.summary?.unpaidFines?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '12px' }}>Violation History ({searchResults.violations?.length || 0})</h4>

            {searchResults.violations?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {searchResults.violations.map((v) => (
                  <div key={v.id} style={{ background: '#0F172A', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{v.violation_type}</span>
                      <span style={{ color: '#FBBF24' }}>₹{v.fine_amount}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Date: {v.violation_date?.split('T')[0]} | Location: {v.location}</span>
                      <span className={`badge badge-${v.status.toLowerCase().replace(' ', '-')}`}>{v.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#22C55E' }}>
                <CheckCircle size={32} style={{ margin: '0 auto 8px' }} />
                No traffic violations recorded for this vehicle! Clean record.
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Footer */}
      <footer style={{ background: '#070B14', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '30px 24px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
        <p>© 2026 Smart Traffic Violation Reporting System. Government Enforcement Division. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
