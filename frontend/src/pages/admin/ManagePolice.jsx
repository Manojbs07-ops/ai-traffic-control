import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { ShieldCheck, PlusCircle, Trash2, Edit, Search } from 'lucide-react';

const ManagePolice = () => {
  const { showToast } = useAuth();

  const [policeList, setPoliceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Police Officer Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [officerForm, setOfficerForm] = useState({
    full_name: '',
    email: '',
    password: 'police123',
    phone: '',
    badge_number: '',
    station_name: 'Central Police Station',
    rank: 'Inspector',
    zone: 'Central Zone'
  });

  const fetchPolice = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/police');
      if (res.data.success) {
        setPoliceList(res.data.police_officers);
      }
    } catch (err) {
      console.error('Failed to fetch police officers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolice();
  }, []);

  const handleCreatePolice = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/police', officerForm);
      if (res.data.success) {
        showToast('Police Officer account registered!', 'success');
        setModalOpen(false);
        setOfficerForm({
          full_name: '', email: '', password: 'police123', phone: '',
          badge_number: '', station_name: 'Central Police Station', rank: 'Inspector', zone: 'Central Zone'
        });
        fetchPolice();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to register officer.', 'error');
    }
  };

  const handleDeletePolice = async (id) => {
    if (!window.confirm('Are you sure you want to remove this police officer?')) return;
    try {
      const res = await API.delete(`/admin/police/${id}`);
      if (res.data.success) {
        showToast('Police officer removed.', 'info');
        fetchPolice();
      }
    } catch (err) {
      showToast('Failed to delete police officer.', 'error');
    }
  };

  const filteredPolice = policeList.filter(p =>
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.badge_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.station_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Police Officer Personnel Directory</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                Register new officers, assign badge numbers and station zones.
              </p>
            </div>

            <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ padding: '10px 18px' }}>
              <PlusCircle size={18} /> Register Police Officer
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} style={{ color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by Name, Badge No, Station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '6px', background: 'transparent', border: 'none',
                  color: '#FFF', outline: 'none', fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#F59E0B' }}>Loading Officer Roster...</div>
            ) : (
              <div className="responsive-table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Badge No</th>
                      <th>Officer Name</th>
                      <th>Rank</th>
                      <th>Station Name</th>
                      <th>Zone</th>
                      <th>Contact Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPolice.map((p) => (
                      <tr key={p.police_id}>
                        <td style={{ fontWeight: 700, color: '#FBBF24' }}>{p.badge_number}</td>
                        <td style={{ fontWeight: 700 }}>{p.full_name}</td>
                        <td><span className="badge badge-approved">{p.rank}</span></td>
                        <td>{p.station_name}</td>
                        <td style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{p.zone}</td>
                        <td>{p.email}</td>
                        <td>
                          <button
                            onClick={() => handleDeletePolice(p.police_id)}
                            className="btn-danger"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Officer Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register Police Officer Account">
        <form onSubmit={handleCreatePolice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Officer Name *</label>
              <input
                type="text"
                required
                value={officerForm.full_name}
                onChange={(e) => setOfficerForm({ ...officerForm, full_name: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Badge Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. POL-6021"
                value={officerForm.badge_number}
                onChange={(e) => setOfficerForm({ ...officerForm, badge_number: e.target.value.toUpperCase() })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A', border: '1px solid #F59E0B', color: '#FBBF24', fontWeight: 700 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Official Email *</label>
              <input
                type="email"
                required
                value={officerForm.email}
                onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Password *</label>
              <input
                type="password"
                required
                value={officerForm.password}
                onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Station Name *</label>
              <input
                type="text"
                required
                value={officerForm.station_name}
                onChange={(e) => setOfficerForm({ ...officerForm, station_name: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Rank</label>
              <input
                type="text"
                value={officerForm.rank}
                onChange={(e) => setOfficerForm({ ...officerForm, rank: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Register Police Officer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManagePolice;
