import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PromptResult } from './types';

interface PromptStore {
  history: PromptResult[];
  availableApiKeys: string[];
  currentApiKeyIndex: number;
  addToHistory: (item: PromptResult) => void;
  clearHistory: () => void;
  deleteItem: (id: string) => void;
  setApiKeys: (keys: string) => void;
  cycleApiKey: () => void;
  getCurrentApiKey: () => string | undefined;
  getTotalApiKeysCount: () => number;
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      history: [],
      availableApiKeys: [],
      currentApiKeyIndex: 0,

      addToHistory: (item) => set((state) => ({ 
        history: [item, ...state.history].slice(0, 50) // Keep last 50
      })),
      clearHistory: () => set({ history: [] }),
      deleteItem: (id) => set((state) => ({
        history: state.history.filter((item) => item.id !== id)
      })),

      setApiKeys: (keysInput) => {
        const keys = keysInput.split('\n').map(key => key.trim()).filter(key => key.length > 0);
        set({ availableApiKeys: keys, currentApiKeyIndex: 0 });
      },

      cycleApiKey: () => set((state) => {
        if (state.availableApiKeys.length === 0) {
          return { currentApiKeyIndex: 0 };
        }
        const nextIndex = (state.currentApiKeyIndex + 1) % state.availableApiKeys.length;
        console.log(`Chuyển đổi API key: từ index ${state.currentApiKeyIndex} sang ${nextIndex}`);
        return { currentApiKeyIndex: nextIndex };
      }),

      getCurrentApiKey: () => {
        const state = get();
        if (state.availableApiKeys.length === 0) {
          return undefined;
        }
        return state.availableApiKeys[state.currentApiKeyIndex];
      },

      getTotalApiKeysCount: () => {
        return get().availableApiKeys.length;
      },
    }),
    {
      name: 'cineprompt-storage',
      // Persist everything except history, which has its own logic
      partialize: (state) => ({ 
        history: state.history,
        availableApiKeys: state.availableApiKeys,
        currentApiKeyIndex: state.currentApiKeyIndex
      }),
    }
  )
);