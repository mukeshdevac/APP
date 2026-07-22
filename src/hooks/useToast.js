/**
 * useToast – lightweight global toast hook.
 * Uses a module-level event emitter so toasts can be
 * triggered from anywhere without prop-drilling or Zustand.
 */

const listeners = new Set();
let nextId = 0;

/** Dispatch a toast to all registered ToastContainers */
const emit = (type, message, duration = 3500) => {
  const id = ++nextId;
  listeners.forEach((cb) => cb({ id, type, message, duration }));
  return id;
};

export const toast = {
  success: (msg, duration) => emit('success', msg, duration),
  error: (msg, duration) => emit('error', msg, duration),
  info: (msg, duration) => emit('info', msg, duration),
  warning: (msg, duration) => emit('warning', msg, duration),
};

/** Subscribe to toast events – used internally by ToastContainer */
export const subscribeToToasts = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};
