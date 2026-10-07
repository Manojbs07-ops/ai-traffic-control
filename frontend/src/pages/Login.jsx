import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, Lock, Mail, UserCheck, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'police') navigate('/police/dashboard');
      else navigate('/user/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res?.success) {
      const role = res.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'police') navigate('/police/dashboard');
      else navigate('/user/dashboard');
    }
  };

  // Demo Login Handler
  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ maxWidth: '460px', margin: '50px auto', padding: '0 20px' }}>
        <div className="glass-panel-glow" style={{ padding: '36px', borderRadius: '20px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '54px', height: '54px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', boxShadow: '0 0 20px rgba(245,158,11,0.4)'
            }}>
              <ShieldAlert size={32} style={{ color: '#0F172A' }} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Account Sign In</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '4px' }}>
              Access Smart Traffic Portal
            </p>
          </div>

          {/* Quick Demo Credentials Box */}
          <div style={{
            background: '#162033', padding: '14px', borderRadius: '12px',
            border: '1px dashed rgba(245,158,11,0.4)', marginBottom: '24px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
              ⚡ Quick Demo One-Click Login
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleDemoFill('john.doe@example.com', 'user123')}
                style={{ background: '#0F172A', color: '#60A5FA', border: '1px solid #3B82F6', borderRadius: '6px', padding: '6px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('officer.kumar@police.gov.in', 'police123')}
                style={{ background: '#0F172A', color: '#FBBF24', border: '1px solid #F59E0B', borderRadius: '6px', padding: '6px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                Police
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin@traffic.gov.in', 'admin123')}
                style={{ background: '#0F172A', color: '#F87171', border: '1px solid #EF4444', borderRadius: '6px', padding: '6px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px',
                    background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px',
                    background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '10px', padding: '14px' }}>
              {loading ? 'Authenticating...' : 'Sign In To Portal'} <LogIn size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#94A3B8' }}>
            Don't have a citizen account?{' '}
            <Link to="/register" style={{ color: '#FBBF24', fontWeight: 600 }}>
              Register Here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
