import { useEffect } from 'react';
import { useStore } from '../lib/store';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe: {
          user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
          };
        };
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

export function useTelegramApp() {
  const { setTelegramUser } = useStore();

  useEffect(() => {
    // Initialize Telegram WebApp
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();

    // Get user data from Telegram WebApp
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user) {
      setTelegramUser({
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    }
  }, [setTelegramUser]);
} 