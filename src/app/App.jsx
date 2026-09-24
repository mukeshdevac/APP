import React, { Suspense, useEffect, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { connectionManager } from '../utils/ConnectionManager';
import { ThemeProvider } from './providers/ThemeProvider';
import ToastContainer from '../components/ui/ToastContainer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Header from '../components/layout/Header';
import useAppStore from '../store/appStore';
import { toast } from '../hooks/useToast';

// --- Lazy-loaded views (code split per route) ---
const ProjectStore   = React.lazy(() => import('../features/store/components/ProjectStore'));
const ProjectDetails = React.lazy(() => import('../features/store/components/ProjectDetails'));
const IDE            = React.lazy(() => import('../features/ide/components/IDE'));
const AIAgent        = React.lazy(() => import('../features/ai-agent/components/AIAgent'));
const SerialTerminal = React.lazy(() => import('../components/common/SerialTerminal'));

// --- Smooth, flicker-free page transition config ---
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function App() {
  // All state from Zustand store
  const view            = useAppStore((s) => s.view);
  const selectedProject = useAppStore((s) => s.selectedProject);
  const isConnected     = useAppStore((s) => s.isConnected);
  const logs            = useAppStore((s) => s.logs);
  const uploadProgress  = useAppStore((s) => s.uploadProgress);
  const moduleBlocks    = useAppStore((s) => s.moduleBlocks); // Blocks logic

  const setView            = useAppStore((s) => s.setView);
  const selectProject      = useAppStore((s) => s.selectProject);
  const setModuleBlocks    = useAppStore((s) => s.setModuleBlocks);
  const setConnected       = useAppStore((s) => s.setConnected);
  const setRunning         = useAppStore((s) => s.setRunning);
  const addLog             = useAppStore((s) => s.addLog);
  const clearLogs          = useAppStore((s) => s.clearLogs);
  const setUploadProgress  = useAppStore((s) => s.setUploadProgress);
  const setTelemetry       = useAppStore((s) => s.setTelemetry);
  const telemetry          = useAppStore((s) => s.telemetry);

  // Wire connectionManager callbacks
  useEffect(() => {
    connectionManager.onData = (line) => {
      const msg = line.trim();
      if (msg.startsWith('STATUS:')) {
        const parts = msg.split(':');
        if (parts.length > 1) setRunning(parts[1].trim() === 'RUNNING');
        return;
      }
      if (msg.startsWith('ERR:')) {
        toast.error('Device Error: ' + msg.substring(4));
        addLog(line);
        return;
      }
      addLog(line);
      if (msg.includes('>>>')) setRunning(false);
    };

    connectionManager.onStatusChange = (status) => {
      setRunning(status === 'RUNNING');
    };

    connectionManager.onDisconnect = () => {
      setConnected(false);
      setRunning(false);
    };

    connectionManager.onTelemetryUpdate = (data) => {
      setTelemetry(data);
    };
  }, [addLog, setConnected, setRunning, setTelemetry]);

  // Sync on connect
  useEffect(() => {
    if (isConnected) {
      if (connectionManager.type === 'serial') connectionManager.write('SERIAL_ON\n');
      connectionManager.write('SYNC\n');
    }
  }, [isConnected]);

  // Scroll to top on view change
  useEffect(() => { window.scrollTo(0, 0); }, [view, selectedProject]);

  // Navigation handlers (stable via useCallback)
  const handleSelectProject = useCallback((project, blocks = null) => {
    selectProject(project);
    if (blocks) setModuleBlocks(blocks);
    setView('ide');
  }, [selectProject, setModuleBlocks, setView]);

  const handleOpenDetails = useCallback((project) => {
    selectProject(project);
    setView('details');
  }, [selectProject, setView]);

  const handleBackToStore = useCallback(() => {
    setView('store');
    selectProject(null);
  }, [setView, selectProject]);

  const handleOpenIde = useCallback(() => {
    selectProject(null);
    setView('ide');
  }, [selectProject, setView]);

  const handleCodeUpload = useCallback(async (code) => {
    if (!isConnected) {
      toast.error('Connect your ESP32 first!');
      return;
    }
    setUploadProgress(1);
    try {
      await connectionManager.uploadCode(code, (p) => setUploadProgress(p));
      toast.success('Code uploaded successfully!');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploadProgress(0);
    }
  }, [isConnected, setUploadProgress]);

  // Lock viewport overflow when in IDE view to guarantee exact screen ratio fit
  useEffect(() => {
    if (view === 'ide') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [view]);

  return (
    <ThemeProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorBoundary>
          <div
            className="App"
            style={{
              height: view === 'ide' ? '100vh' : 'auto',
              minHeight: view === 'ide' ? '100vh' : '100vh',
              maxHeight: view === 'ide' ? '100vh' : 'none',
              width: '100vw',
              maxWidth: '100vw',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--background)',
              color: 'var(--text)',
              overflow: view === 'ide' ? 'hidden' : 'visible'
            }}
          >
            <AnimatePresence>
              {view !== 'ide' && (
                <Motion.div
                  key="app-header-bar"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  style={{ width: '100%', zIndex: 100 }}
                >
                  <Header
                    isConnected={isConnected}
                    setIsConnected={setConnected}
                    onHome={handleBackToStore}
                    view={view}
                    setView={setView}
                    onUpload={handleCodeUpload}
                    uploadProgress={uploadProgress}
                    onOpenIde={handleOpenIde}
                    telemetry={telemetry}
                  />
                </Motion.div>
              )}
            </AnimatePresence>

            <main
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: view === 'ide' ? '100%' : 'auto',
                maxHeight: view === 'ide' ? '100%' : 'none',
                minHeight: 0,
                overflow: 'hidden',
                padding: view === 'ide' ? '0' : '0 clamp(10px, 2vw, 20px)'
              }}
            >
              <AnimatePresence mode="wait">
                <Motion.div
                  key={view}
                  initial={pageVariants.initial}
                  animate={pageVariants.animate}
                  exit={pageVariants.exit}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={view === 'ai' ? 'ai-view-wrapper' : ''}
                  style={{
                    height: view === 'ide' ? '100%' : 'auto',
                    maxHeight: view === 'ide' ? '100%' : 'none',
                    minHeight: 0,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    {view === 'store' && (
                      <ProjectStore onSelectProject={handleSelectProject} onOpenDetails={handleOpenDetails} />
                    )}
                    {view === 'details' && (
                      <ProjectDetails project={selectedProject} onBack={handleBackToStore} onLoad={handleSelectProject} />
                    )}
                    {view === 'ide' && (
                      <IDE
                        project={selectedProject}
                        onBack={handleBackToStore}
                        isConnected={isConnected}
                        setView={setView}
                        uploadProgress={uploadProgress}
                        logs={logs}
                        onClearLogs={clearLogs}
                        onUpload={handleCodeUpload}
                      />
                    )}
                    {view === 'ai' && (
                      <div className="ai-view-container">
                        <div className="ai-view-agent">
                          <AIAgent onUpload={handleCodeUpload} onClose={() => setView('store')} isEmbedded={true} isConnected={isConnected} uploadProgress={uploadProgress} />
                        </div>
                        <div className="ai-view-terminal">
                          <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Motion.div animate={{ opacity: isConnected ? [1, 0.4, 1] : 1 }} transition={{ repeat: Infinity, duration: 2 }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? 'var(--success)' : 'var(--text-muted)' }} />
                            </Motion.div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--terminal-text)' }}>Serial Monitor</span>
                          </div>
                          <div style={{ flex: 1, overflow: 'hidden', padding: '10px' }}>
                            <SerialTerminal logs={logs} onClear={clearLogs} isEmbedded={true} />
                          </div>
                        </div>
                      </div>
                    )}
                  </Suspense>
                </Motion.div>
              </AnimatePresence>
            </main>

            {view !== 'ide' && (
              <footer style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  TEN ROBOTICS v1.0 • Built for ESP32 &amp; MicroPython
                </p>
              </footer>
            )}
          </div>
        </ErrorBoundary>
      </Suspense>

      {/* Global Toast Notification System */}
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
