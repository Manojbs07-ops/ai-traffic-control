import React from 'react';
import Modal from './Modal';
import { ShieldCheck, Printer, CheckCircle, Download } from 'lucide-react';

const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Payment Receipt">
      <div id="printable-receipt" style={{
        background: '#FFFFFF',
        color: '#0F172A',
        padding: '30px',
        borderRadius: '16px',
        border: '2px solid #E2E8F0',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed #CBD5E1', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A', fontWeight: 800, fontSize: '1.2rem' }}>
              <ShieldCheck size={24} style={{ color: '#F59E0B' }} />
              TRAFFIC VIOLATION SYSTEM
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
              Government Traffic Enforcement Authority
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              background: '#DCFCE7',
              color: '#15803D',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle size={16} /> PAID
            </span>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
              {new Date(receipt.payment_date).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Receipt Key-Value Rows */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem', marginBottom: '24px' }}>
          <div>
            <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Receipt No</div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>{receipt.payment_number}</div>
          </div>
          <div>
            <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Transaction ID</div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>{receipt.transaction_id}</div>
          </div>
          <div>
            <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Violation No</div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>{receipt.violation_number}</div>
          </div>
          <div>
            <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Vehicle Registration</div>
            <div style={{ fontWeight: 700, color: '#D97706' }}>{receipt.vehicle_number}</div>
          </div>
          <div>
            <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Violation Offence</div>
            <div style={{ fontWeight: 600 }}>{receipt.violation_type}</div>
          </div>
          <div>
            <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Payment Method</div>
            <div style={{ fontWeight: 600 }}>{receipt.payment_method}</div>
          </div>
        </div>

        {/* Amount Total */}
        <div style={{
          background: '#F8FAFC',
          padding: '16px 20px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #E2E8F0'
        }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#334155' }}>Total Fine Amount Paid</span>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#15803D' }}>
            ₹{parseFloat(receipt.amount).toLocaleString('en-IN')}
          </span>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8', marginTop: '20px' }}>
          This is an official computer-generated receipt. No physical signature is required.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
        <button onClick={handlePrint} className="btn-primary" style={{ padding: '10px 20px' }}>
          <Printer size={18} /> Print Receipt
        </button>
        <button onClick={onClose} className="btn-secondary" style={{ padding: '10px 20px' }}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
