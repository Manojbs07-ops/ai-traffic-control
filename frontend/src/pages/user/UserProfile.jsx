import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Citizen Account Profile</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Personal information registered with Traffic Enforcement Authority.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '36px', borderRadius: '16px', maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#0F172A', fontWeight: 800, fontSize: '1.8rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.full_name}</h2>
                <div style={{ fontSize: '0.85rem', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <ShieldCheck size={16} /> Verified Citizen Account ({user?.role?.toUpperCase()})
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#162033', padding: '14px 18px', borderRadius: '10px' }}>
                <Mail size={20} style={{ color: '#F59E0B' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Email Address</div>
                  <div style={{ fontWeight: 600 }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#162033', padding: '14px 18px', borderRadius: '10px' }}>
                <Phone size={20} style={{ color: '#F59E0B' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Phone Contact</div>
                  <div style={{ fontWeight: 600 }}>{user?.phone || 'Not Provided'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#162033', padding: '14px 18px', borderRadius: '10px' }}>
                <MapPin size={20} style={{ color: '#F59E0B' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Registered Address</div>
                  <div style={{ fontWeight: 600 }}>{user?.address || 'Not Provided'}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
