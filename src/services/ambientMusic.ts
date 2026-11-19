// Procedural Web Audio Ambient Soundscapes & Lo-Fi Beats for Deep Academic Focus
// 100% offline, zero external audio assets required.

export interface AmbientTrack {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beats' | 'nature' | 'binaural' | 'drone';
}

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'lofi',
    name: 'Lo-Fi Chill Beats',
    description: 'Calm electric piano chords with vinyl texture at 72 BPM',
    icon: '🎧',
    category: 'beats'
  },
  {
    id: 'rain',
    name: 'Monsoon Rain & Thunder',
    description: 'Deep rain on window pane with soft ambient thunder',
    icon: '🌧️',
    category: 'nature'
  },
  {
    id: 'alpha',
    name: '40Hz Alpha Binaural Beats',
    description: 'Scientifically tuned frequencies for rapid memory recall & focus',
    icon: '🧠',
    category: 'binaural'
  },
  {
    id: 'drone',
    name: 'Cosmic Deep Space Synth',
    description: 'Warm analog detuned drone with slow hypnotic filter sweeps',
    icon: '🌌',
    category: 'drone'
  },
  {
    id: 'waves',
    name: 'Midnight Ocean Surf',
    description: 'Slow rhythmic tidal surf and gentle nocturnal wind',
    icon: '🌊',
    category: 'nature'
  },
  {
    id: 'coffee',
    name: 'Library & Study Cafe',
    description: 'Subtle warm room acoustic atmosphere for quiet diligence',
    icon: '☕',
    category: 'nature'
  }
];

export interface MusicPlayerState {
  isPlaying: boolean;
  activeTrackId: string;
  volume: number;
}

type StateListener = (state: MusicPlayerState) => void;

class AmbientMusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlayingState = false;
  private activeTrackId = 'lofi';
  private volumeLevel = 0.6;
  private timerId: number | null = null;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private listeners: Set<StateListener> = new Set();

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private notify() {
    const state: MusicPlayerState = {
      isPlaying: this.isPlayingState,
      activeTrackId: this.activeTrackId,
      volume: this.volumeLevel
    };
    this.listeners.forEach(fn => fn(state));
  }

  public subscribe(fn: StateListener): () => void {
    this.listeners.add(fn);
    fn({
      isPlaying: this.isPlayingState,
      activeTrackId: this.activeTrackId,
      volume: this.volumeLevel
    });
    return () => this.listeners.delete(fn);
  }

  public getState(): MusicPlayerState {
    return {
      isPlaying: this.isPlayingState,
      activeTrackId: this.activeTrackId,
      volume: this.volumeLevel
    };
  }

  public setVolume(vol: number) {
    this.volumeLevel = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volumeLevel * 0.45, this.ctx.currentTime);
    }
    this.notify();
  }

  public stop() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore node cleanup errors
      }
    });
    this.activeNodes = [];
    this.isPlayingState = false;
    this.notify();
  }

  public async playTrack(trackId: string) {
    this.stop();
    this.activeTrackId = trackId;
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    // Master gain
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volumeLevel * 0.45, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    this.isPlayingState = true;
    this.notify();

    switch (trackId) {
      case 'lofi':
        this.startLofiEngine(ctx, this.masterGain);
        break;
      case 'rain':
        this.startRainEngine(ctx, this.masterGain);
        break;
      case 'alpha':
        this.startAlphaBinauralEngine(ctx, this.masterGain);
        break;
      case 'drone':
        this.startCosmicDroneEngine(ctx, this.masterGain);
        break;
      case 'waves':
        this.startOceanWavesEngine(ctx, this.masterGain);
        break;
      case 'coffee':
        this.startCoffeeAmbienceEngine(ctx, this.masterGain);
        break;
      default:
        this.startLofiEngine(ctx, this.masterGain);
    }
  }

  public toggle(trackId?: string) {
    if (this.isPlayingState) {
      if (trackId && trackId !== this.activeTrackId) {
        this.playTrack(trackId);
      } else {
        this.stop();
      }
    } else {
      this.playTrack(trackId || this.activeTrackId);
    }
  }

  // 1. LO-FI BEAT ENGINE
  private startLofiEngine(ctx: AudioContext, destination: AudioNode) {
    // Vinyl crackle simulation via filtered white noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.015;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1200;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.08;

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);
    whiteNoise.start();
    this.activeNodes.push(whiteNoise);

    // Warm Rhodes Piano Chords Progression (Cmaj7 -> Am7 -> Fmaj7 -> G7)
    const chordProgressions = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.0, 261.63, 329.63, 392.0],  // Am7 (A3, C4, E4, G4)
      [174.61, 220.0, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [196.0, 246.94, 293.66, 349.23]  // G7 (G3, B3, D4, F4)
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!this.isPlayingState) return;
      const now = ctx.currentTime;
      const notes = chordProgressions[chordIndex % chordProgressions.length];
      chordIndex++;

      notes.forEach((freq, noteIdx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + noteIdx * 0.03);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(destination);

        osc.start(now + noteIdx * 0.03);
        osc.stop(now + 3.0);
      });

      // Soft rim pulse
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.type = 'triangle';
      kickOsc.frequency.setValueAtTime(110, now);
      kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      kickGain.gain.setValueAtTime(0.2, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      kickOsc.connect(kickGain);
      kickGain.connect(destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.3);
    };

    playChord();
    this.timerId = window.setInterval(playChord, 3200);
  }

  // 2. MONSOON RAIN ENGINE
  private startRainEngine(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    // Pink / Brownian noise filter
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const rainNoise = ctx.createBufferSource();
    rainNoise.buffer = noiseBuffer;
    rainNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gain = ctx.createGain();
    gain.gain.value = 0.22;

    rainNoise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    rainNoise.start();
    this.activeNodes.push(rainNoise);

    // Periodic thunder rumble
    const triggerThunder = () => {
      if (!this.isPlayingState) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const thunderGain = ctx.createGain();
      const thunderFilter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 2.5);

      thunderFilter.type = 'lowpass';
      thunderFilter.frequency.setValueAtTime(140, now);

      thunderGain.gain.setValueAtTime(0.001, now);
      thunderGain.gain.linearRampToValueAtTime(0.18, now + 0.6);
      thunderGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

      osc.connect(thunderFilter);
      thunderFilter.connect(thunderGain);
      thunderGain.connect(destination);

      osc.start(now);
      osc.stop(now + 3.6);
    };

    this.timerId = window.setInterval(triggerThunder, 14000);
  }

  // 3. 40HZ ALPHA BINAURAL BEAT ENGINE
  private startAlphaBinauralEngine(ctx: AudioContext, destination: AudioNode) {
    // Left ear: 216 Hz, Right ear: 256 Hz -> 40Hz difference (Gamma/Alpha cognition)
    const baseFreq = 216;
    const beatFreq = 40;

    const oscLeft = ctx.createOscillator();
    const oscRight = ctx.createOscillator();
    const merger = ctx.createChannelMerger(2);
    const gain = ctx.createGain();

    oscLeft.type = 'sine';
    oscLeft.frequency.value = baseFreq;

    oscRight.type = 'sine';
    oscRight.frequency.value = baseFreq + beatFreq;

    gain.gain.value = 0.15;

    oscLeft.connect(merger, 0, 0); // Channel 0 (Left)
    oscRight.connect(merger, 0, 1); // Channel 1 (Right)
    merger.connect(gain);
    gain.connect(destination);

    oscLeft.start();
    oscRight.start();

    this.activeNodes.push(oscLeft, oscRight);
  }

  // 4. COSMIC DEEP SPACE SYNTH DRONE
  private startCosmicDroneEngine(ctx: AudioContext, destination: AudioNode) {
    const freqs = [65.41, 130.81, 196.0, 261.63]; // C2, C3, G3, C4
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    // Slow LFO for filter breath
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1; // 10s cycle
    lfoGain.gain.value = 180;
    lfo.connect(filter.frequency);
    lfo.start();
    this.activeNodes.push(lfo);

    const gain = ctx.createGain();
    gain.gain.value = 0.12;

    freqs.forEach(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = f + (Math.random() - 0.5) * 1.5; // subtle detuning
      osc.connect(filter);
      osc.start();
      this.activeNodes.push(osc);
    });

    filter.connect(gain);
    gain.connect(destination);
  }

  // 5. OCEAN SURF ENGINE
  private startOceanWavesEngine(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 2.0;

    // LFO to simulate wave swells
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.12; // 8s wave cycle
    lfoGain.gain.value = 280;
    lfo.connect(filter.frequency);
    lfo.start();

    const gain = ctx.createGain();
    gain.gain.value = 0.22;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noise.start();
    this.activeNodes.push(noise, lfo);
  }

  // 6. COFFEE SHOP ENGINE
  private startCoffeeAmbienceEngine(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;

    const gain = ctx.createGain();
    gain.gain.value = 0.16;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    noise.start();
    this.activeNodes.push(noise);
  }
}

export const ambientMusic = new AmbientMusicEngine();
