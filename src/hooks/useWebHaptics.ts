import { useCallback, useState, useEffect } from 'react';

export type HapticsType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

let globalAudioCtx: AudioContext | null = null;
let soundEnabled = true;

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('amicro_sound_enabled');
    soundEnabled = saved !== null ? saved === 'true' : true;
  } catch {
    soundEnabled = true;
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!globalAudioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        globalAudioCtx = new AudioCtx();
      }
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume();
    }
    return globalAudioCtx;
  } catch {
    return null;
  }
}

function playSynthesizedHaptic(type: HapticsType) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      // Pleasant subtle two-tone chime for copy actions
      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(1240, now + 0.06);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else {
      // Soft mechanical tactile click
      osc.type = 'triangle';
      const freq = type === 'medium' ? 1400 : type === 'heavy' ? 1100 : 1750;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.02);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
      osc.start(now);
      osc.stop(now + 0.025);
    }
  } catch {
    // Non-blocking fallback
  }
}

export function useWebHaptics() {
  const [isSoundOn, setIsSoundOn] = useState(soundEnabled);

  useEffect(() => {
    setIsSoundOn(soundEnabled);
  }, []);

  const toggleSound = useCallback(() => {
    soundEnabled = !soundEnabled;
    setIsSoundOn(soundEnabled);
    try {
      localStorage.setItem('amicro_sound_enabled', String(soundEnabled));
    } catch {}
    if (soundEnabled) {
      playSynthesizedHaptic('light');
    }
  }, []);

  const trigger = useCallback((type: HapticsType = 'light') => {
    // 1. Play synthesized tactile audio
    playSynthesizedHaptic(type);

    // 2. Trigger hardware vibration on mobile if supported
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
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
            return window.navigator.vibrate(10);
        }
      } catch {
        return false;
      }
    }

    return true;
  }, []);

  return { trigger, isSoundOn, toggleSound };
}

