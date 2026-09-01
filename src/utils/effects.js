import confetti from 'canvas-confetti';

/**
 * Triggers a multi-colored celebration confetti burst
 */
export function triggerCompletionConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b']
  });
}

/**
 * Web Audio API synthesizer for clean sound feedback (no external files needed)
 */
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Resonant multi-harmonic celebration chime for Pomodoro completion
   */
  playTimerAlarm() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const ctx = this.ctx;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;

      // Play a warm 3-stage melodic bell sequence: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
      const notes = [
        { freq: 523.25, time: now },
        { freq: 659.25, time: now + 0.18 },
        { freq: 783.99, time: now + 0.36 },
        { freq: 1046.50, time: now + 0.54 }
      ];

      notes.forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const harmonic = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        harmonic.type = 'triangle';
        harmonic.frequency.setValueAtTime(freq * 2, time); // 1 octave above

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

        osc.connect(gain);
        harmonic.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        harmonic.start(time);
        osc.stop(time + 0.8);
        harmonic.stop(time + 0.8);
      });
    } catch (e) {
      console.warn('Timer alarm playback failed', e);
    }
  }

  playCompletionChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      // Crisp high note progression (E5 -> B5 -> E6)
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.08);
      osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.16);

      osc2.frequency.setValueAtTime(329.63, now);
      osc2.frequency.exponentialRampToValueAtTime(493.88, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio playback suppressed', e);
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio error', e);
    }
  }
}

export const soundFx = new SoundEffects();

