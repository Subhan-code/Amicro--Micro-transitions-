import { useCallback } from 'react';

export type HapticsType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useWebHaptics() {
  const trigger = useCallback((type: HapticsType = 'light') => {
    if (typeof window === 'undefined' || !window.navigator || !window.navigator.vibrate) {
      return false;
    }

    try {
      switch (type) {
        case 'light':
          return window.navigator.vibrate(10);
        case 'medium':
          return window.navigator.vibrate(25);
        case 'heavy':
          return window.navigator.vibrate(50);
        case 'success':
          return window.navigator.vibrate([15, 60, 15]);
        case 'warning':
          return window.navigator.vibrate([30, 60, 30]);
        case 'error':
          return window.navigator.vibrate([60, 60, 60, 60, 60]);
        default:
          return window.navigator.vibrate(type as any);
      }
    } catch (e) {
      console.warn('Vibration API error:', e);
      return false;
    }
  }, []);

  return { trigger };
}
