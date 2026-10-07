import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import ReceiptModal from '../../components/ReceiptModal';
import { ArrowLeft, CreditCard, ShieldCheck, MapPin, Calendar, Clock, Image, Printer, AlertTriangle } from 'lucide-react';

const ViolationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [violation, setViolation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/violations/${id}`);
        if (res.data.success) {
          setViolation(res.data.violation);
        }
      } catch (err) {
        console.error('Failed to fetch violation details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
        <Navbar />
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flex: 1, padding: '40px', textAlign: 'center', color: '#F59E0B' }}>
            Loading Violation Details...
          </div>
        </div>
      </div>
    );
  }

  if (!violation) {
    return (
      <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
        <Navbar />
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
            <h2>Violation record not found.</h2>
            <Link to="/user/violations" className="btn-secondary" style={{ marginTop: '16px' }}>Back to Violations</Link>
          </div>
        </div>
      </div>
    );
  }

  const receiptData = violation.status === 'Paid' ? {
    payment_number: violation.payment_number || 'PAY-OFFICIAL',
    transaction_id: violation.transaction_id || 'TXN-SETTLED',
    payment_date: violation.payment_date || new Date().toISOString(),
    amount: violation.fine_amount,
    payment_method: violation.payment_method || 'Digital Gateway',
    violation_number: violation.violation_number,
    vehicle_number: violation.vehicle_number,
    violation_type: violation.violation_type
  } : null;

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back
          </button>

          <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>VIOLATION CITATION</div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24', marginTop: '2px' }}>{violation.violation_number}</h1>
                <div style={{ fontSize: '0.9rem', color: '#CBD5E1', marginTop: '4px' }}>Vehicle: <strong style={{ color: '#FFF' }}>{violation.vehicle_number}</strong> ({violation.vehicle_type})</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge badge-${violation.status ? violation.status.toLowerCase().replace(' ', '-') : 'pending'}`} style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                  {violation.status || 'Pending'}
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#EF4444', marginTop: '8px' }}>
                  ₹{violation.fine_amount}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '24px' }}>
              
              {/* Evidence Photo */}
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24' }}>
                  <Image size={18} /> Photographic Evidence
                </h3>
                <div style={{
                  background: '#0F172A',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.15)',
                  minHeight: '220px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {violation.evidence_image ? (
                    <img
                      src={violation.evidence_image}
                      alt="Violation Evidence"
                      style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                      <AlertTriangle size={32} style={{ margin: '0 auto 8px' }} />
                      No photographic evidence image attached.
                    </div>
                  )}
                </div>
              </div>

              {/* Infraction Specs */}
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', color: '#FBBF24' }}>Infraction Metadata</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#162033', padding: '20px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Offence Type</div>
                      <div style={{ fontWeight: 700 }}>{violation.violation_type}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={18} style={{ color: '#F59E0B' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Incident Location</div>
                      <div style={{ fontWeight: 600 }}>{violation.location}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar size={18} style={{ color: '#F59E0B' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Date & Time</div>
                      <div style={{ fontWeight: 600 }}>
                        {violation.violation_date ? violation.violation_date.split('T')[0] : ''} at {violation.violation_time}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShieldCheck size={18} style={{ color: '#F59E0B' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Reporting Officer</div>
                      <div style={{ fontWeight: 600 }}>
                        {violation.police_name || 'Traffic Police Inspector'} ({violation.badge_number || 'Station Officer'})
                      </div>
                    </div>
                  </div>
                </div>

                {violation.description && (
                  <div style={{ marginTop: '16px', background: '#0F172A', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>Officer Remarks:</div>
                    <div style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>{violation.description}</div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ marginTop: '24px' }}>
                  {violation.status === 'Approved' && (
                    <button
                      onClick={() => navigate(`/user/payment?violationId=${violation.id}`)}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
                    >
                      <CreditCard size={18} /> Pay Fine Now (₹{violation.fine_amount})
                    </button>
                  )}

                  {violation.status === 'Paid' && (
                    <button
                      onClick={() => setReceiptModalOpen(true)}
                      className="btn-success"
                      style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
                    >
                      <Printer size={18} /> View & Print Digital Receipt
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
        </main>
      </div>

      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={receiptData}
      />
    </div>
  );
};

export default ViolationDetails;
