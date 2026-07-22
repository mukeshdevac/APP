import React from 'react';
import { motion as Motion } from 'framer-motion';

const TABS = ['learning', 'reviews', 'comments'];

const ProjectTabBar = React.memo(({ activeTab, onTabChange }) => (
  <div
    style={{
      display: 'flex',
      gap: '1rem',
      borderBottom: '1px solid var(--border)',
      marginBottom: '1.5rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
    }}
  >
    {TABS.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        style={{
          background: 'none',
          border: 'none',
          color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
          fontWeight: '600',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          position: 'relative',
          textTransform: 'capitalize',
          transition: 'color 0.2s',
          whiteSpace: 'nowrap',
          minHeight: '44px',
        }}
      >
        {tab}
        {activeTab === tab && (
          <Motion.div
            layoutId="activeTab"
            style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: '2px', background: 'var(--primary)' }}
          />
        )}
      </button>
    ))}
  </div>
));

ProjectTabBar.displayName = 'ProjectTabBar';

export default ProjectTabBar;
