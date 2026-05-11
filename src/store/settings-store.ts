import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  twelveDataApiKey: string;
  enableSimulation: boolean;
  theme: 'dark' | 'light' | 'terminal';
  
  setTwelveDataApiKey: (key: string) => void;
  setEnableSimulation: (enabled: boolean) => void;
  setTheme: (theme: 'dark' | 'light' | 'terminal') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      twelveDataApiKey: import.meta.env.VITE_TWELVE_DATA_API_KEY || '',
      enableSimulation: true,
      theme: 'dark',

      setTwelveDataApiKey: (key) => set({ twelveDataApiKey: key }),
      setEnableSimulation: (enabled) => set({ enableSimulation: enabled }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'anst-settings-storage',
    }
  )
);
