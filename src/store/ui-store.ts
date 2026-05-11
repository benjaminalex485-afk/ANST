import { create } from 'zustand';
import { IEvent } from '../events/types';

interface UIState {
  activeTab: string;
  commandPaletteOpen: boolean;
  focusedPanelId: string | null;
  dispatch: (event: IEvent) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'dashboard',
  commandPaletteOpen: false,
  focusedPanelId: null,

  dispatch: (event: IEvent) => {
    switch (event.type) {
      case 'ui:tab_changed':
        set({ activeTab: event.payload.tab });
        break;
      case 'ui:palette_toggled':
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen }));
        break;
      case 'ui:palette_set':
        set({ commandPaletteOpen: event.payload.open });
        break;
      case 'ui:panel_focused':
        set({ focusedPanelId: event.payload.id });
        break;
    }
  },
}));
import { eventBus } from '../events/event-bus';
eventBus.subscribe('ui:*', (event) => useUIStore.getState().dispatch(event), 'store:ui');
