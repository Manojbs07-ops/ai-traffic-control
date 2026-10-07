import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, User, LogOut, LayoutDashboard, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'police') return '/police/dashboard';
    return '/user/dashboard';
  };

  return (
    <nav className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
          }}>
            <ShieldAlert style={{ color: '#0F172A', width: '26px', height: '26px' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>
              Traffic<span style={{ color: '#FBBF24' }}>Reporter</span>
            </span>
            <span style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Govt Digital Portal
            </span>
          </div>
        </RouterLink>

        {/* Desktop Navigation Links */}
        <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <RouterLink to="/" style={{ color: '#CBD5E1', fontWeight: 500, transition: '0.2s' }}>Home</RouterLink>
          <RouterLink to="/about" style={{ color: '#CBD5E1', fontWeight: 500, transition: '0.2s' }}>About</RouterLink>
          <RouterLink to="/#features" onClick={() => {
            const el = document.getElementById('features');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} style={{ color: '#CBD5E1', fontWeight: 500 }}>Features</RouterLink>
          <RouterLink to="/#how-it-works" onClick={() => {
            const el = document.getElementById('how-it-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} style={{ color: '#CBD5E1', fontWeight: 500 }}>Services</RouterLink>
          <RouterLink to="/contact" style={{ color: '#CBD5E1', fontWeight: 500, transition: '0.2s' }}>Contact</RouterLink>
        </div>

        {/* Right Side Buttons / User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#F59E0B',
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.full_name?.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.65rem', color: '#FBBF24', textTransform: 'uppercase' }}>{user?.role}</div>
                </div>
                <ChevronDown size={14} style={{ color: '#94A3B8' }} />
              </button>

              {userDropdownOpen && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '200px',
                  padding: '8px',
                  borderRadius: '12px',
                  zIndex: 200,
                  boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
                }}>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate(getDashboardPath());
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'transparent',
                      color: '#E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      borderRadius: '8px',
                      textAlign: 'left'
                    }}
                  >
                    <LayoutDashboard size={16} style={{ color: '#F59E0B' }} /> Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'transparent',
                      color: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      borderRadius: '8px',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <RouterLink to="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                Login
              </RouterLink>
              <RouterLink to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                Register
              </RouterLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
