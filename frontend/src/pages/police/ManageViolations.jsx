import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { CheckCircle, XCircle, Eye, Filter, Edit3, ShieldAlert } from 'lucide-react';

const ManageViolations = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const filterParam = searchParams.get('filter') || 'all';

  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Approval / Rejection Modal state
  const [activeModal, setActiveModal] = useState(null); // 'approve' | 'reject' | null
  const [selectedVio, setSelectedVio] = useState(null);
  const [modalFine, setModalFine] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const fetchPoliceViolations = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/police/violations?filter=${filterParam}`);
      if (res.data.success) {
        setViolations(res.data.violations);
      }
    } catch (err) {
      console.error('Failed to fetch police violations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoliceViolations();
  }, [filterParam]);

  const handleOpenApprove = (v) => {
    setSelectedVio(v);
    setModalFine(v.fine_amount);
    setActiveModal('approve');
  };

  const handleOpenReject = (v) => {
    setSelectedVio(v);
    setRejectReason('');
    setActiveModal('reject');
  };

  const submitApprove = async () => {
    if (!selectedVio) return;
    try {
      const res = await API.put(`/police/violations/${selectedVio.id}/approve`, {
        fine_amount: parseFloat(modalFine)
      });
      if (res.data.success) {
        showToast(`Violation ${selectedVio.violation_number} approved!`, 'success');
        setActiveModal(null);
        fetchPoliceViolations();
      }
    } catch (err) {
      showToast('Approval failed.', 'error');
    }
  };

  const submitReject = async () => {
    if (!selectedVio) return;
    try {
      const res = await API.put(`/police/violations/${selectedVio.id}/reject`, {
        rejection_reason: rejectReason
      });
      if (res.data.success) {
        showToast(`Violation ${selectedVio.violation_number} rejected.`, 'info');
        setActiveModal(null);
        fetchPoliceViolations();
      }
    } catch (err) {
      showToast('Rejection failed.', 'error');
    }
  };

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Manage Violation Citations</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                Review pending submissions, verify image evidence, approve citations or reject invalid reports.
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            {[
              { id: 'all', label: 'All Violations' },
              { id: 'pending', label: 'Pending Verification' },
              { id: 'approved', label: 'Approved Fines' },
              { id: 'rejected', label: 'Rejected Reports' },
              { id: 'my', label: 'My Submissions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id === 'all' ? '/police/violations' : `/police/violations?filter=${tab.id}`)}
                className={filterParam === tab.id ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Violations Table */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#F59E0B' }}>Loading Citations Queue...</div>
            ) : (
              <div className="responsive-table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Violation ID</th>
                      <th>Vehicle Reg</th>
                      <th>Offence Type</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Fine</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {violations.length > 0 ? (
                      violations.map((v) => (
                        <tr key={v.id}>
                          <td style={{ fontWeight: 700, color: '#FBBF24' }}>{v.violation_number}</td>
                          <td style={{ fontWeight: 600 }}>{v.vehicle_number}</td>
                          <td>{v.violation_type}</td>
                          <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{v.location}</td>
                          <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                            {v.violation_date ? v.violation_date.split('T')[0] : ''}
                          </td>
                          <td style={{ fontWeight: 700, color: '#FBBF24' }}>₹{v.fine_amount}</td>
                          <td>
                            <span className={`badge badge-${v.status.toLowerCase().replace(' ', '-')}`}>
                              {v.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => navigate(`/police/violation/${v.id}`)}
                                className="btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              >
                                <Eye size={14} /> View
                              </button>

                              {v.status === 'Pending Verification' && (
                                <>
                                  <button
                                    onClick={() => handleOpenApprove(v)}
                                    className="btn-success"
                                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                  >
                                    <CheckCircle size={14} /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleOpenReject(v)}
                                    className="btn-danger"
                                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                  >
                                    <XCircle size={14} /> Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                          No citation records found matching filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Approve Modal */}
      <Modal isOpen={activeModal === 'approve'} onClose={() => setActiveModal(null)} title="Approve Citation & Set Fine">
        <div>
          <p style={{ color: '#CBD5E1', marginBottom: '16px' }}>
            Confirm approval for citation <strong>{selectedVio?.violation_number}</strong> ({selectedVio?.vehicle_number}).
          </p>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Adjust Fine Amount (₹)</label>
            <input
              type="number"
              value={modalFine}
              onChange={(e) => setModalFine(e.target.value)}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A',
                border: '1px solid #F59E0B', color: '#FBBF24', fontSize: '1.1rem', fontWeight: 800
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={submitApprove} className="btn-success">Approve & Issue Fine</button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={activeModal === 'reject'} onClose={() => setActiveModal(null)} title="Reject Violation Report">
        <div>
          <p style={{ color: '#CBD5E1', marginBottom: '16px' }}>
            Specify reason for rejecting citation <strong>{selectedVio?.violation_number}</strong>:
          </p>
          <div style={{ marginBottom: '16px' }}>
            <textarea
              rows={3}
              placeholder="e.g. Unclear license plate evidence / Duplicate report"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A',
                border: '1px solid rgba(255,255,255,0.15)', color: '#FFF'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={submitReject} className="btn-danger">Confirm Rejection</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageViolations;
