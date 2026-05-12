import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  twelveDataApiKey: string;
  enableSimulation: boolean;
  theme: 'dark' | 'light' | 'terminal';
  startingCapital: number;
  
  setTwelveDataApiKey: (key: string) => void;
  setEnableSimulation: (enabled: boolean) => void;
  setStartingCapital: (val: number) => void;
  setTheme: (theme: 'dark' | 'light' | 'terminal') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      twelveDataApiKey: import.meta.env.VITE_TWELVE_DATA_API_KEY || '',
      enableSimulation: false, // Force dormant by default now
      theme: 'dark',
      startingCapital: 100000, // Conservative baseline default

      setTwelveDataApiKey: (key) => set({ twelveDataApiKey: key }),
      setEnableSimulation: (enabled) => set({ enableSimulation: enabled }),
      setStartingCapital: (val) => set({ startingCapital: val }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'anst-settings-storage',
    }
  )
);
