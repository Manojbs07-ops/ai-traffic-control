import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Upload, ShieldAlert, CheckCircle } from 'lucide-react';

const violationFinesMap = {
  'Speeding': 2000,
  'Signal Jump': 1500,
  'No Helmet': 1000,
  'No Seat Belt': 1000,
  'Wrong Parking': 500,
  'Drunk Driving': 10000,
  'Driving Without License': 5000,
  'Triple Riding': 1000,
  'Wrong Side Driving': 2000,
  'Mobile Phone Usage': 1500
};

const ReportViolation = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [formData, setFormData] = useState({
    vehicle_number: '',
    vehicle_type: 'Car',
    violation_type: 'Speeding',
    location: '',
    violation_date: new Date().toISOString().split('T')[0],
    violation_time: new Date().toTimeString().slice(0, 5),
    description: '',
    fine_amount: 2000
  });

  const [evidenceFile, setEvidenceFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleViolationTypeChange = (val) => {
    const defaultFine = violationFinesMap[val] || 1000;
    setFormData(prev => ({
      ...prev,
      violation_type: val,
      fine_amount: defaultFine
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvidenceFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicle_number || !formData.location) {
      showToast('Please provide vehicle registration number and incident location.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (evidenceFile) {
        data.append('evidence_image', evidenceFile);
      }

      const res = await API.post('/violations', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        showToast(`Violation report ${res.data.violation_number} created successfully!`, 'success');
        navigate('/police/violations');
      }
    } catch (err) {
      console.error('Failed to create violation report:', err);
      showToast(err.response?.data?.message || 'Failed to submit violation report.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Log Traffic Violation Report</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Authorized Officer Entry Form • Upload citation evidence image and log infraction specs.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '36px', borderRadius: '16px', maxWidth: '800px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Row 1: Vehicle Reg & Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 600 }}>
                    Vehicle Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN 01 AB 1234"
                    value={formData.vehicle_number}
                    onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value.toUpperCase() })}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '10px', background: '#0F172A',
                      border: '1px solid var(--accent-amber)', color: '#FFF', fontSize: '1rem', fontWeight: 700, outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 600 }}>
                    Vehicle Type *
                  </label>
                  <select
                    value={formData.vehicle_type}
                    onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '10px', background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                    }}
                  >
                    <option value="Car">Car / SUV</option>
                    <option value="Two Wheeler">Two Wheeler (Motorcycle / Scooter)</option>
                    <option value="Commercial Truck">Commercial Truck</option>
                    <option value="Bus">Public / Private Bus</option>
                    <option value="Auto Rickshaw">Auto Rickshaw</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Violation Type & Fine Amount */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 600 }}>
                    Violation Offence Category *
                  </label>
                  <select
                    value={formData.violation_type}
                    onChange={(e) => handleViolationTypeChange(e.target.value)}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '10px', background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                    }}
                  >
                    {Object.keys(violationFinesMap).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 600 }}>
                    Penalty Fine Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.fine_amount}
                    onChange={(e) => setFormData({ ...formData, fine_amount: e.target.value })}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '10px', background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#FBBF24', fontSize: '1.1rem', fontWeight: 800, outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Location */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 600 }}>
                  Incident Spot Location / Junction *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anna Salai Signal 4, Guindy Sector"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px', background: '#0F172A',
                    border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                  }}
                />
              </div>

              {/* Row 4: Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Incident Date</label>
                  <input
                    type="date"
                    required
                    value={formData.violation_date}
                    onChange={(e) => setFormData({ ...formData, violation_date: e.target.value })}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '10px', background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Incident Time</label>
                  <input
                    type="time"
                    required
                    value={formData.violation_time}
                    onChange={(e) => setFormData({ ...formData, violation_time: e.target.value })}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '10px', background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Officer Remarks & Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide specific notes regarding vehicle speed, traffic density, or driver details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px', background: '#0F172A',
                    border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                  }}
                />
              </div>

              {/* Evidence Upload Box */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '8px', fontWeight: 600 }}>
                  Upload Photo Evidence (JPG, JPEG, PNG, WEBP)
                </label>
                <div style={{
                  border: '2px dashed rgba(245, 158, 11, 0.4)',
                  padding: '24px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  background: '#0F172A',
                  cursor: 'pointer'
                }}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    id="evidence-file"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="evidence-file" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={32} style={{ color: '#F59E0B' }} />
                    <span style={{ fontSize: '0.9rem', color: '#CBD5E1', fontWeight: 600 }}>
                      {evidenceFile ? evidenceFile.name : 'Click to Browse Evidence Image'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Max file size: 5MB</span>
                  </label>
                </div>

                {filePreview && (
                  <div style={{ marginTop: '14px', textAlign: 'center' }}>
                    <img src={filePreview} alt="Preview" style={{ maxHeight: '180px', borderRadius: '10px', border: '1px solid #F59E0B' }} />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
              >
                <PlusCircle size={20} /> {submitting ? 'Dispatching Report...' : 'Log & Issue Citation Report'}
              </button>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportViolation;
