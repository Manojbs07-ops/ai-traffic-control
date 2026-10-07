import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Mail, Phone, MapPin, Award } from 'lucide-react';

const PoliceProfile = () => {
  const { user } = useAuth();

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Police Officer Profile</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Authorized law enforcement officer identification card & station assignment.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '36px', borderRadius: '16px', maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#0F172A', fontWeight: 800, fontSize: '1.8rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(245,158,11,0.4)'
              }}>
                <ShieldCheck size={36} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.full_name}</h2>
                <div style={{ fontSize: '0.9rem', color: '#FBBF24', fontWeight: 700, marginTop: '2px' }}>
                  Badge Number: {user?.badge_number || 'POL-4092'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                  Rank: {user?.rank || 'Inspector'} • Zone: {user?.zone || 'Central Zone'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#162033', padding: '14px 18px', borderRadius: '10px' }}>
                <MapPin size={20} style={{ color: '#F59E0B' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Assigned Station</div>
                  <div style={{ fontWeight: 600 }}>{user?.station_name || 'Central Police Station'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#162033', padding: '14px 18px', borderRadius: '10px' }}>
                <Mail size={20} style={{ color: '#F59E0B' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Official Email</div>
                  <div style={{ fontWeight: 600 }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#162033', padding: '14px 18px', borderRadius: '10px' }}>
                <Phone size={20} style={{ color: '#F59E0B' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Station Hotline</div>
                  <div style={{ fontWeight: 600 }}>{user?.phone || '+91 98765 43211'}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PoliceProfile;
