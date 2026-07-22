import React from 'react';
import { Play, Upload, Square, Activity, BookOpen, MessageSquare } from 'lucide-react';

const ProjectActionsSidebar = React.memo(({
  project,
  isConnected,
  isUploading,
  uploadProgress,
  onLoad,
  onUpload,
  onRun,
  onStop,
}) => (
  <div
    className="glass"
    style={{ padding: '2rem', borderRadius: '24px', position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '0' }}
  >
    <h3 style={{ marginBottom: '1.5rem' }}>Project Actions</h3>

    {/* Execution Controls */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>

      <button
        onClick={onUpload}
        disabled={!isConnected || isUploading}
        className="btn btn-primary"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '1rem',
          background: isUploading ? 'var(--surface-light)' : 'var(--primary)',
          opacity: isConnected ? 1 : 0.5,
          cursor: isConnected ? 'pointer' : 'not-allowed',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Upload progress bar */}
        {isUploading && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              height: '4px',
              background: 'rgba(255,255,255,0.8)',
              width: `${uploadProgress}%`,
              transition: 'width 0.2s ease-out',
            }}
          />
        )}
        <Upload size={20} />
        <span style={{ fontWeight: '600' }}>
          {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload to ESP32'}
        </span>
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button
          onClick={onRun}
          disabled={!isConnected}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isConnected ? 1 : 0.5, cursor: isConnected ? 'pointer' : 'not-allowed' }}
        >
          <Play size={18} fill="currentColor" /> Run
        </button>
        <button
          onClick={onStop}
          disabled={!isConnected}
          className="btn btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            opacity: isConnected ? 1 : 0.5,
            cursor: isConnected ? 'pointer' : 'not-allowed',
          }}
        >
          <Square size={18} fill="currentColor" /> Stop
        </button>
      </div>

      {!isConnected && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: '#ef4444',
            padding: '0.75rem',
            background: 'rgba(239, 68, 68, 0.08)',
            borderRadius: '8px',
          }}
          role="alert"
        >
          <Activity size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          Connect your ESP32 via the header to deploy this project.
        </div>
      )}
    </div>

    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 1.5rem 0' }} />

    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Features</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <BookOpen size={18} /> <span>Ready-to-run Code</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <MessageSquare size={18} /> <span>Community Support</span>
      </div>
    </div>
  </div>
));

ProjectActionsSidebar.displayName = 'ProjectActionsSidebar';

export default ProjectActionsSidebar;
