import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Mail, Phone, ShieldCheck } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>System Administrator Profile</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Master administrative account with unrestricted system access.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '36px', borderRadius: '16px', maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                color: '#FFF', fontWeight: 800, fontSize: '1.8rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(239,68,68,0.4)'
              }}>
                <ShieldAlert size={36} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.full_name}</h2>
                <div style={{ fontSize: '0.9rem', color: '#F87171', fontWeight: 700, marginTop: '2px' }}>
                  Super Admin Account (Root Clearance)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#162033', padding: '14px 18px', borderRadius: '10px' }}>
                <Mail size={20} style={{ color: '#F59E0B' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Administrator Email</div>
                  <div style={{ fontWeight: 600 }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#162033', padding: '14px 18px', borderRadius: '10px' }}>
                <ShieldCheck size={20} style={{ color: '#F59E0B' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Role Scope</div>
                  <div style={{ fontWeight: 600 }}>Full CRUD over Users, Police Officers, Violations, Payments</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
