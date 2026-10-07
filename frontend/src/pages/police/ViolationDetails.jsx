import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { ArrowLeft, CheckCircle, XCircle, MapPin, Calendar, Clock, Image, AlertTriangle } from 'lucide-react';

const PoliceViolationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [violation, setViolation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal
  const [activeModal, setActiveModal] = useState(null);
  const [modalFine, setModalFine] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const fetchDetails = async () => {
    try {
      const res = await API.get(`/violations/${id}`);
      if (res.data.success) {
        setViolation(res.data.violation);
        setModalFine(res.data.violation.fine_amount);
      }
    } catch (err) {
      console.error('Failed to fetch details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const submitApprove = async () => {
    try {
      const res = await API.put(`/police/violations/${id}/approve`, { fine_amount: parseFloat(modalFine) });
      if (res.data.success) {
        showToast('Citation approved successfully!', 'success');
        setActiveModal(null);
        fetchDetails();
      }
    } catch (err) {
      showToast('Approval failed.', 'error');
    }
  };

  const submitReject = async () => {
    try {
      const res = await API.put(`/police/violations/${id}/reject`, { rejection_reason: rejectReason });
      if (res.data.success) {
        showToast('Citation rejected.', 'info');
        setActiveModal(null);
        fetchDetails();
      }
    } catch (err) {
      showToast('Rejection failed.', 'error');
    }
  };

  if (loading) return <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFF' }}><Navbar /><div style={{ padding: '40px', textAlign: 'center' }}>Loading Details...</div></div>;
  if (!violation) return <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFF' }}><Navbar /><div style={{ padding: '40px', textAlign: 'center' }}>Record Not Found.</div></div>;

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to List
          </button>

          <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>POLICE CITATION FILE</div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24' }}>{violation.violation_number}</h1>
                <div style={{ fontSize: '0.9rem', color: '#CBD5E1', marginTop: '4px' }}>Vehicle: <strong>{violation.vehicle_number}</strong> ({violation.vehicle_type})</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge badge-${violation.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                  {violation.status}
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FBBF24', marginTop: '8px' }}>
                  ₹{violation.fine_amount}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', color: '#FBBF24' }}>Evidence Photo</h3>
                <div style={{ background: '#0F172A', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {violation.evidence_image ? (
                    <img src={violation.evidence_image} alt="Evidence" style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ color: '#64748B' }}>No Evidence Image Uploaded</div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', color: '#FBBF24' }}>Incident Specs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#162033', padding: '20px', borderRadius: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Offence Category:</span>
                    <div style={{ fontWeight: 700 }}>{violation.violation_type}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Location:</span>
                    <div style={{ fontWeight: 600 }}>{violation.location}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Date & Time:</span>
                    <div style={{ fontWeight: 600 }}>{violation.violation_date?.split('T')[0]} at {violation.violation_time}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Registered Owner:</span>
                    <div style={{ fontWeight: 600 }}>{violation.owner_name || 'Vehicle Owner'}</div>
                  </div>
                </div>

                {violation.status === 'Pending Verification' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '24px' }}>
                    <button onClick={() => setActiveModal('approve')} className="btn-success" style={{ justifyContent: 'center', padding: '12px' }}>
                      <CheckCircle size={18} /> Approve Fine
                    </button>
                    <button onClick={() => setActiveModal('reject')} className="btn-danger" style={{ justifyContent: 'center', padding: '12px' }}>
                      <XCircle size={18} /> Reject Citation
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={activeModal === 'approve'} onClose={() => setActiveModal(null)} title="Approve Violation Citation">
        <div>
          <p style={{ color: '#CBD5E1', marginBottom: '16px' }}>Adjust or confirm fine amount:</p>
          <input
            type="number"
            value={modalFine}
            onChange={(e) => setModalFine(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A', border: '1px solid #F59E0B', color: '#FFF', fontSize: '1.1rem', fontWeight: 800 }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={submitApprove} className="btn-success">Approve & Enforce</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'reject'} onClose={() => setActiveModal(null)} title="Reject Violation Report">
        <div>
          <textarea
            rows={3}
            placeholder="Rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={submitReject} className="btn-danger">Confirm Rejection</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PoliceViolationDetails;
