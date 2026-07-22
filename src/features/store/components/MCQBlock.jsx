import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const MCQBlock = React.memo(({ mcq }) => {
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const isCorrect = selected === mcq.correctIndex;

  const handleSelect = (i) => {
    if (selected !== null) return; // Lock after first answer
    setSelected(i);
    setShowExplanation(true);
  };

  return (
    <div
      className="glass"
      style={{
        padding: '1.5rem',
        borderRadius: '20px',
        border: selected !== null
          ? (isCorrect ? '1px solid var(--success)' : '1px solid var(--error)')
          : '1px solid var(--border)',
        transition: 'border-color 0.3s',
      }}
    >
      <p style={{ fontWeight: '700', marginBottom: '1rem', fontSize: '1rem' }}>{mcq.question}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
        {mcq.options.map((opt, i) => {
          const isSelected = selected === i;
          const isAnswer = i === mcq.correctIndex;
          const bgColor = selected !== null
            ? (isAnswer ? 'rgba(16,185,129,0.15)' : isSelected ? 'rgba(239,68,68,0.15)' : 'var(--surface-light)')
            : 'var(--surface-light)';
          const borderColor = selected !== null
            ? (isAnswer ? 'rgba(16,185,129,0.5)' : isSelected ? 'rgba(239,68,68,0.5)' : 'var(--border)')
            : 'var(--border)';

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className="glass"
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: bgColor,
                color: 'var(--text)',
                cursor: selected !== null ? 'default' : 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.25s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {selected !== null && isAnswer && <CheckCircle size={16} color="var(--success)" />}
              {selected !== null && isSelected && !isAnswer && <XCircle size={16} color="var(--error)" />}
              {opt}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <Motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            borderRadius: '8px',
            fontSize: '0.85rem',
          }}
        >
          <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
            {isCorrect ? '✓ Correct! ' : '✗ Not quite. '}
          </strong>
          {mcq.explanation}
        </Motion.div>
      )}
    </div>
  );
});

MCQBlock.displayName = 'MCQBlock';

export default MCQBlock;
