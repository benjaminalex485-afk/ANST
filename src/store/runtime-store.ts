import { create } from 'zustand';
import { RuntimeMode, RuntimeState } from '../core/runtime-types';

interface IRuntimeState {
  mode: RuntimeMode;
  state: RuntimeState;
  lastError: string | null;
  
  // Atomic Actions
  transitionTo: (nextState: RuntimeState) => void;
  setMode: (nextMode: RuntimeMode) => void;
  reportError: (message: string) => void;
}

/**
 * Centralized store monitoring the critical health and mode of the system.
 * DOES NOT CONTAIN BUSINESS LOGIC. Solely orchestrates environmental life cycle.
 */
export const useRuntimeStore = create<IRuntimeState>((set) => ({
  mode: RuntimeMode.DEVELOPMENT,
  state: RuntimeState.BOOTING,
  lastError: null,

  transitionTo: (nextState) => set({ state: nextState }),
  setMode: (nextMode) => set({ mode: nextMode }),
  reportError: (message) => set({ 
    state: RuntimeState.ERROR, 
    lastError: message 
  }),
}));
