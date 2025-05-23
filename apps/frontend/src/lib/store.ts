import { create } from 'zustand';

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface AppState {
  telegramUser: TelegramUser | null;
  setTelegramUser: (user: TelegramUser | null) => void;
}

export const useStore = create<AppState>((set) => ({
  telegramUser: null,
  setTelegramUser: (user) => set({ telegramUser: user }),
})); 