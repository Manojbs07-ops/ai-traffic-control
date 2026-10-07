import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { Users, UserPlus, Trash2, Edit, Search, CheckCircle, XCircle } from 'lucide-react';

const ManageUsers = () => {
  const { showToast } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add User Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '', email: '', password: '', phone: '', address: '', role: 'citizen'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/users', newUser);
      if (res.data.success) {
        showToast('User account created!', 'success');
        setModalOpen(false);
        setNewUser({ full_name: '', email: '', password: '', phone: '', address: '', role: 'citizen' });
        fetchUsers();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create user.', 'error');
    }
  };

  const handleToggleStatus = async (userObj) => {
    const nextStatus = userObj.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await API.put(`/admin/users/${userObj.id}`, { status: nextStatus });
      if (res.data.success) {
        showToast(`User status updated to ${nextStatus}.`, 'info');
        fetchUsers();
      }
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await API.delete(`/admin/users/${id}`);
      if (res.data.success) {
        showToast('User deleted.', 'info');
        fetchUsers();
      }
    } catch (err) {
      showToast('Failed to delete user.', 'error');
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Manage Citizen Accounts</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                System user directory, account status toggles and creation.
              </p>
            </div>

            <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ padding: '10px 18px' }}>
              <UserPlus size={18} /> Add New User
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} style={{ color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by Name or Email..."
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
              <div style={{ textAlign: 'center', padding: '40px', color: '#F59E0B' }}>Loading Directory...</div>
            ) : (
              <div className="responsive-table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td style={{ fontWeight: 700 }}>{u.full_name}</td>
                        <td>{u.email}</td>
                        <td style={{ color: '#94A3B8' }}>{u.phone || 'N/A'}</td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'badge-rejected' : u.role === 'police' ? 'badge-pending' : 'badge-approved'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.status === 'active' ? 'badge-paid' : 'badge-rejected'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className="btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              {u.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="btn-danger"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New System User">
        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Full Name *</label>
            <input
              type="text"
              required
              value={newUser.full_name}
              onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Email Address *</label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Password *</label>
            <input
              type="password"
              required
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Phone</label>
            <input
              type="text"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Account</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsers;
