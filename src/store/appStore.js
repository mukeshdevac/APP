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

  setTelemetry: (newTelemetry) => set((state) => {
    const cur = state.telemetry;
    // Guard: preserve known positive pack voltage against partial zero drops
    const v = (newTelemetry.v !== undefined && Number(newTelemetry.v) > 0)
      ? Number(newTelemetry.v)
      : (newTelemetry.v !== undefined && !cur.v ? Number(newTelemetry.v) : cur.v);
    const pct = newTelemetry.pct !== undefined ? Number(newTelemetry.pct) : (newTelemetry.b !== undefined ? Number(newTelemetry.b) : cur.pct);
    const ma = newTelemetry.ma !== undefined ? Number(newTelemetry.ma) : (newTelemetry.i !== undefined ? Number(newTelemetry.i) : cur.ma);
    const p = newTelemetry.p !== undefined ? Number(newTelemetry.p) : (ma > 0 && v > 0 ? Number((v * (ma / 1000.0)).toFixed(2)) : cur.p);
    const b = pct;

    if (cur.v === v && cur.pct === pct && cur.ma === ma && cur.p === p && cur.b === b) {
      return state;
    }

    return {
      telemetry: { v, pct, ma, p, b }
    };
  }),

  addLog: (line) =>
    set((state) => ({
      logs: [...state.logs, line].slice(-200),
    })),

  clearLogs: () => set({ logs: [] }),
}));

export default useAppStore;
