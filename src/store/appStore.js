import { create } from 'zustand';

/**
 * Global application store.
 * Replaces multiple useState calls scattered across App.jsx.
 */
const useAppStore = create((set) => ({
  // Navigation
  view: 'store', // 'store' | 'ide' | 'details' | 'ai'
  selectedProject: null,

  // Device state
  isConnected: false,
  isRunning: false,
  uploadProgress: 0,
  telemetry: { v: 0, i: 0, p: 0, b: 0 },

  // Terminal logs (capped at 200 entries)
  logs: [],

  // Blocks logic
  moduleBlocks: null,

  // --- Actions ---
  setView: (view) => set({ view }),

  selectProject: (project) => set({ selectedProject: project }),

  setModuleBlocks: (xml) => set({ moduleBlocks: xml }),

  setConnected: (isConnected) => set({ isConnected }),

  setRunning: (isRunning) => set({ isRunning }),

  setUploadProgress: (uploadProgress) => set({ uploadProgress }),

  setTelemetry: (telemetry) => set({ telemetry }),

  addLog: (line) =>
    set((state) => ({
      logs: [...state.logs, line].slice(-200),
    })),

  clearLogs: () => set({ logs: [] }),
}));

export default useAppStore;
