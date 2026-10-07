import React from 'react';
import Navbar from '../components/Navbar';
import { ShieldAlert, CheckCircle, Target, Lock, Database, Award } from 'lucide-react';

const About = () => {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ABOUT SYSTEM
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '8px' }}>Smart Traffic Violation Reporting System</h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginTop: '10px' }}>
            Empowering traffic authorities and citizens with transparent digital governance.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '36px', borderRadius: '16px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#FBBF24', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={24} /> System Mission & Overview
          </h2>
          <p style={{ color: '#CBD5E1', lineHeight: 1.8, fontSize: '1rem', marginBottom: '16px' }}>
            The Smart Traffic Violation Reporting System is designed to replace legacy paper-based fine handling with a modern, high-speed digital infrastructure. By streamlining infraction reporting, verification, and online payment processing, the system ensures complete transparency and accountability in road traffic management.
          </p>
          <p style={{ color: '#CBD5E1', lineHeight: 1.8, fontSize: '1rem' }}>
            Traffic officers can record violations directly on site, upload photographic evidence, and automatically notify vehicle owners. Citizens gain instant access to inspect their recorded citations, lodge appeals, or settle fines digitally without visiting police stations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <Lock size={28} style={{ color: '#F59E0B', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Role-Based Access Control</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Strict JWT-backed authentication ensuring role segregation between Citizens, Police Officers, and System Administrators.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <Database size={28} style={{ color: '#F59E0B', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Relational Data Integrity</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Built upon MySQL database schemas with foreign key constraints, indexing on registration numbers, and transactional payment logs.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <Award size={28} style={{ color: '#F59E0B', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Digital Receipts & Audit</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Computer-generated receipts with transaction references for instant printing and official record keeping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
