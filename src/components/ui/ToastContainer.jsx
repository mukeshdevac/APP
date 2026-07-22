import React, { useState, useEffect, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { subscribeToToasts } from '../../hooks/useToast';

const ICONS = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const COLORS = {
  success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', icon: '#10b981' },
  error:   { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  icon: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', icon: '#f59e0b' },
  info:    { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)', icon: '#6366f1' },
};

const Toast = React.memo(({ toast, onDismiss }) => {
  const colors = COLORS[toast.type] || COLORS.info;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '14px 16px',
        borderRadius: '14px',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        minWidth: '280px',
        maxWidth: '400px',
        cursor: 'pointer',
        pointerEvents: 'all',
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <span style={{ color: colors.icon, flexShrink: 0, marginTop: '1px' }}>
        {ICONS[toast.type]}
      </span>
      <span style={{ flex: 1, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text)', fontWeight: '500' }}>
        {toast.message}
      </span>
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0', flexShrink: 0 }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </Motion.div>
  );
});

Toast.displayName = 'Toast';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((newToast) => {
      setToasts((prev) => [...prev, newToast]);
    });
    return unsubscribe;
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="sync">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
