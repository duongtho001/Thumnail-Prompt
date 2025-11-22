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
  initializeApiKeys: () => void;
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

      initializeApiKeys: () => {
        if (typeof process !== 'undefined' && process.env.API_KEY) {
          const keys = process.env.API_KEY.split(',').map(key => key.trim()).filter(key => key.length > 0);
          set({ availableApiKeys: keys, currentApiKeyIndex: 0 });
        } else {
          console.warn("process.env.API_KEY is not defined or is empty. Please configure your API key(s).");
          set({ availableApiKeys: [], currentApiKeyIndex: 0 });
        }
      },

      cycleApiKey: () => set((state) => {
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
      partialize: (state) => ({ history: state.history }), // Only persist history, keys are re-initialized
      onRehydrateStorage: () => (state) => {
        state?.initializeApiKeys(); // Re-initialize API keys when store rehydrates
      },
    }
  )
);