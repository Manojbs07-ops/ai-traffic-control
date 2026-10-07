import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useAuth();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-green-400" />;
        let toastClass = 'toast-success';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-red-400" />;
          toastClass = 'toast-error';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-blue-400" />;
          toastClass = 'toast-info';
        }

        return (
          <div key={toast.id} className={`toast-item ${toastClass}`}>
            {icon}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
