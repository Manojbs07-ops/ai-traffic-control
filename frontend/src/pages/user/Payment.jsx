import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ReceiptModal from '../../components/ReceiptModal';
import { CreditCard, QrCode, Building, Lock, ShieldCheck, CheckCircle } from 'lucide-react';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const preselectedId = searchParams.get('violationId');

  const [unpaidViolations, setUnpaidViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Payment Form Fields
  const [upiId, setUpiId] = useState('user@upi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('981');
  const [bankName, setBankName] = useState('State Bank of India');

  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchUnpaid = async () => {
      try {
        const res = await API.get('/violations?user_only=true&status=Approved');
        if (res.data.success) {
          setUnpaidViolations(res.data.violations);
          if (preselectedId) {
            setSelectedViolation(preselectedId);
          } else if (res.data.violations.length > 0) {
            setSelectedViolation(res.data.violations[0].id.toString());
          }
        }
      } catch (err) {
        console.error('Failed to load unpaid violations:', err);
      }
    };
    fetchUnpaid();
  }, [preselectedId]);

  const activeVio = unpaidViolations.find(v => v.id.toString() === selectedViolation);

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!selectedViolation) {
      showToast('Please select a pending violation to clear.', 'error');
      return;
    }

    setProcessing(true);

    try {
      const payload = {
        violation_id: parseInt(selectedViolation),
        payment_method: paymentMethod,
        upi_id: paymentMethod === 'UPI' ? upiId : undefined,
        card_number: paymentMethod === 'Card' ? cardNumber : undefined,
        bank_name: paymentMethod === 'Net Banking' ? bankName : undefined
      };

      const res = await API.post('/payments', payload);

      if (res.data.success) {
        showToast('Payment successful! Digital receipt generated.', 'success');
        setReceipt(res.data.receipt);
        setModalOpen(true);
        // Refresh unpaid list
        setUnpaidViolations(prev => prev.filter(v => v.id.toString() !== selectedViolation));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Payment processing failed.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#FFFFFF' }}>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '30px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Digital Fine Payment Gateway</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Secure simulated fine payment for approved traffic offences.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            
            {/* Form */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px' }}>
              <form onSubmit={handlePaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Select Citation */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '8px', fontWeight: 600 }}>
                    Select Unpaid Citation *
                  </label>
                  {unpaidViolations.length > 0 ? (
                    <select
                      value={selectedViolation}
                      onChange={(e) => setSelectedViolation(e.target.value)}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '10px', background: '#0F172A',
                        border: '1px solid var(--accent-amber)', color: '#FFF', outline: 'none', fontSize: '0.95rem'
                      }}
                    >
                      {unpaidViolations.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.violation_number} - {v.vehicle_number} ({v.violation_type}) - ₹{v.fine_amount}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ padding: '14px', background: '#162033', borderRadius: '8px', color: '#22C55E', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={18} /> All fine citations under your account are fully paid!
                    </div>
                  )}
                </div>

                {/* Payment Method Options */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '10px', fontWeight: 600 }}>
                    Payment Method
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        background: paymentMethod === 'UPI' ? 'rgba(245, 158, 11, 0.2)' : '#0F172A',
                        border: paymentMethod === 'UPI' ? '2px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
                        color: paymentMethod === 'UPI' ? '#FBBF24' : '#94A3B8',
                        fontWeight: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <QrCode size={20} /> UPI / QR
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Card')}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        background: paymentMethod === 'Card' ? 'rgba(245, 158, 11, 0.2)' : '#0F172A',
                        border: paymentMethod === 'Card' ? '2px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
                        color: paymentMethod === 'Card' ? '#FBBF24' : '#94A3B8',
                        fontWeight: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CreditCard size={20} /> Card
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Net Banking')}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        background: paymentMethod === 'Net Banking' ? 'rgba(245, 158, 11, 0.2)' : '#0F172A',
                        border: paymentMethod === 'Net Banking' ? '2px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
                        color: paymentMethod === 'Net Banking' ? '#FBBF24' : '#94A3B8',
                        fontWeight: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Building size={20} /> Net Banking
                    </button>
                  </div>
                </div>

                {/* Conditional Payment Inputs */}
                {paymentMethod === 'UPI' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>VPA / UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      style={{
                        width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A',
                        border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                      }}
                    />
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{
                          width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A',
                          border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          style={{
                            width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A',
                            border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          style={{
                            width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A',
                            border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Net Banking' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px' }}>Select Bank</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '8px', background: '#0F172A',
                        border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none'
                      }}
                    >
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={processing || !activeVio}
                  style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
                >
                  <Lock size={18} /> {processing ? 'Authorizing Payment...' : `Pay ₹${activeVio?.fine_amount || 0} Securely`}
                </button>
              </form>
            </div>

            {/* Selected Summary Sidebar */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FBBF24', marginBottom: '16px' }}>Checkout Order Breakdown</h3>
              
              {activeVio ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#94A3B8' }}>Citation Number:</span>
                    <span style={{ fontWeight: 700 }}>{activeVio.violation_number}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#94A3B8' }}>Vehicle Reg:</span>
                    <span style={{ fontWeight: 600 }}>{activeVio.vehicle_number}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#94A3B8' }}>Offence:</span>
                    <span>{activeVio.violation_type}</span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total Fine:</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#22C55E' }}>₹{activeVio.fine_amount}</span>
                  </div>

                  <div style={{ background: '#162033', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#94A3B8', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={20} style={{ color: '#22C55E' }} />
                    256-bit SSL Encrypted Demo Payment Gateway.
                  </div>
                </div>
              ) : (
                <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No citation selected for payment.</div>
              )}
            </div>

          </div>
        </main>
      </div>

      <ReceiptModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          navigate('/user/payment-history');
        }}
        receipt={receipt}
      />
    </div>
  );
};

export default Payment;
