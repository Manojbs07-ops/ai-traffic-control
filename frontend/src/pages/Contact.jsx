import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const { showToast } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been dispatched to Traffic Control Command.', 'success');
  };

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            HELP & SUPPORT
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '8px' }}>Contact Traffic Enforcement Division</h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', marginTop: '8px' }}>
            Have questions about a fine or need assistance with vehicle record verification?
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {/* Contact Info */}
          <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#FBBF24', marginBottom: '24px' }}>Control Tower Headquarters</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <MapPin size={22} style={{ color: '#F59E0B', marginTop: '4px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Central Traffic Command</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Sector 4, Enforcement Avenue, Metro City, 600001</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Phone size={22} style={{ color: '#F59E0B' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Helpline Toll-Free</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>1800-425-9090 (24x7 Control Room)</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Mail size={22} style={{ color: '#F59E0B' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Official Email</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>support@traffic.gov.in</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '20px' }}>Dispatch Inquiry</h3>
            
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircle size={48} style={{ color: '#22C55E', margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Inquiry Received!</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '8px' }}>
                  A traffic desk officer will review your query within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Violation inquiry / Fine discrepancy"
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details regarding your citation or issue..."
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                    }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '8px' }}>
                  <Send size={18} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
