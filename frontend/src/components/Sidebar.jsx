import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  AlertTriangle,
  CreditCard,
  History,
  User,
  PlusCircle,
  FileCheck,
  FileX,
  Users,
  ShieldCheck,
  LogOut,
  Receipt
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const role = user.role;

  let links = [];

  if (role === 'citizen') {
    links = [
      { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/user/report', label: 'Report Violation', icon: PlusCircle },
      { to: '/user/violations', label: 'My Violations', icon: AlertTriangle },
      { to: '/user/payment', label: 'Pay Fines', icon: CreditCard },
      { to: '/user/payment-history', label: 'Payment History', icon: History },
      { to: '/user/profile', label: 'My Profile', icon: User }
    ];
  } else if (role === 'police') {
    links = [
      { to: '/police/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/police/report', label: 'Report Violation', icon: PlusCircle },
      { to: '/police/violations', label: 'All Violations', icon: AlertTriangle },
      { to: '/police/pending', label: 'Pending Review', icon: History },
      { to: '/police/approved', label: 'Approved Fines', icon: FileCheck },
      { to: '/police/rejected', label: 'Rejected Reports', icon: FileX },
      { to: '/police/profile', label: 'Police Profile', icon: User }
    ];
  } else if (role === 'admin') {
    links = [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/users', label: 'Manage Users', icon: Users },
      { to: '/admin/police', label: 'Police Officers', icon: ShieldCheck },
      { to: '/admin/violations', label: 'All Violations', icon: AlertTriangle },
      { to: '/admin/payments', label: 'Revenue & Payments', icon: Receipt },
      { to: '/admin/profile', label: 'Admin Profile', icon: User }
    ];
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="glass-panel" style={{
      width: '260px',
      minHeight: 'calc(100vh - 75px)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: '0 16px 16px 0',
      borderLeft: 'none'
    }}>
      <div>
        {/* User Info Header Badge */}
        <div style={{
          padding: '14px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '12px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            LOGGED IN AS
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
            {user.full_name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            <span className={`badge ${role === 'admin' ? 'badge-rejected' : role === 'police' ? 'badge-pending' : 'badge-approved'}`}>
              {role.toUpperCase()} {user.badge_number ? `(${user.badge_number})` : ''}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {links.map((link) => {
            const IconComponent = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#0F172A' : '#CBD5E1',
                  background: isActive
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                    : 'transparent',
                  boxShadow: isActive ? '0 4px 15px rgba(245, 158, 11, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                })}
              >
                <IconComponent size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="btn-secondary"
        style={{
          width: '100%',
          justifyContent: 'center',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          color: '#F87171',
          marginTop: '24px'
        }}
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
