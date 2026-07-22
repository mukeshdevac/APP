import React from 'react';
import { motion as Motion } from 'framer-motion';

/**
 * Full-screen loading spinner used as Suspense fallback for lazy-loaded views.
 */
const LoadingSpinner = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '16px',
    }}
  >
    <Motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, ease: 'linear', repeat: Infinity }}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '3px solid var(--surface-light)',
        borderTopColor: 'var(--primary)',
      }}
    />
    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</span>
  </div>
);

export default LoadingSpinner;
