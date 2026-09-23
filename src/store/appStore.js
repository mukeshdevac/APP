import { create } from 'zustand';

/**
 * Global application store.
 * Manages view routing, project state, device connectivity, and live battery telemetry.
 */
const useAppStore = create((set) => ({
  // Navigation
  view: 'store', // 'store' | 'ide' | 'details' | 'ai'
  selectedProject: null,

  // Device state
  isConnected: false,
  isRunning: false,
  uploadProgress: 0,
  
  // Power & Battery Telemetry
  telemetry: {
    v: 0.0,    // Voltage (e.g. 7.4V)
    pct: 0,    // Battery Percentage (0-100%)
    ma: 0.0,   // Current in mA
    p: 0.0,    // Power in Watts
    b: 0       // Alias for percentage
  },

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

  setTelemetry: (telemetry) => set((state) => ({
    telemetry: {
      ...state.telemetry,
      ...telemetry,
      pct: telemetry.pct !== undefined ? telemetry.pct : (telemetry.b !== undefined ? telemetry.b : state.telemetry.pct)
    }
  })),

  addLog: (line) =>
    set((state) => ({
      logs: [...state.logs, line].slice(-200),
    })),

  clearLogs: () => set({ logs: [] }),
}));

export default useAppStore;
