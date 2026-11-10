// Новогодний звуковой движок на Web Audio API:
// хрустальная челеста, колокольчики и мягкая музыкальная шкатулка с эхом.

class HolidayAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private fxBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private muted = false;
  private musicPlaying = false;
  private musicTimer: number | null = null;
  private noteIdx = 0;

  // Собственная зимняя миниатюра: 16 тактов, мягкое электропиано и тёплые аккорды.
  private readonly PHRASES = [
    [72, 76, 79, 83, 81, 79, 76, 74],
    [72, 76, 79, 81, 79, 76, 74, 71],
    [69, 72, 76, 79, 77, 76, 72, 74],
    [71, 74, 77, 79, 77, 74, 71, 67],
    [72, 76, 79, 84, 83, 79, 76, 74],
    [69, 72, 76, 81, 79, 76, 74, 72],
    [65, 69, 72, 77, 76, 72, 74, 71],
    [67, 71, 74, 79, 76, 74, 72, 0],
  ];
  private readonly CHORDS = [
    [48, 55, 59, 64], [43, 55, 59, 62],
    [45, 52, 55, 60], [40, 52, 55, 59],
    [41, 53, 57, 60], [48, 52, 55, 59],
    [50, 53, 57, 60], [43, 53, 59, 62],
  ];

  private piano(midi: number, at: number, duration: number, volume: number) {
    const ctx = this.ctx;
    if (!ctx || !this.musicBus || !midi) return;
    const t = ctx.currentTime + at;
    const frequency = 440 * Math.pow(2, (midi - 69) / 12);
    [1, 2, 3].forEach((partial, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency * partial;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(volume * [1, 0.12, 0.025][i], t + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      osc.connect(gain);
      gain.connect(this.musicBus!);
      osc.start(t);
      osc.stop(t + duration + 0.05);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    });
  }

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;

    if (!this.ctx) {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.9;
      this.master.connect(this.ctx.destination);

      // Мягкая линия эха (создаёт ощущение зимнего зала / шкатулки)
      const delay = this.ctx.createDelay(1.0);
      delay.delayTime.value = 0.28;
      const feedback = this.ctx.createGain();
      feedback.gain.value = 0.32;
      const lp = this.ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2400;

      delay.connect(lp);
      lp.connect(feedback);
      feedback.connect(delay);
      lp.connect(this.master);

      this.fxBus = this.ctx.createGain();
      this.fxBus.gain.value = 0.8;
      this.fxBus.connect(this.master);
      this.fxBus.connect(delay);

      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.24;
      this.musicBus.connect(this.master);
      this.musicBus.connect(delay);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Хрустальная нота челесты / колокольчика */
  private bell(freq: number, delaySec = 0, duration = 1.1, vol = 0.14, bus: "fx" | "music" = "fx") {
    const ctx = this.ensure();
    if (!ctx || this.muted) return;
    const target = bus === "music" ? this.musicBus : this.fxBus;
    if (!target) return;

    const t = ctx.currentTime + delaySec;

    // основной тон
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, t);

    g1.gain.setValueAtTime(0.0001, t);
    g1.gain.linearRampToValueAtTime(vol, t + 0.012);
    g1.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc1.connect(g1);
    g1.connect(target);
    osc1.start(t);
    osc1.stop(t + duration + 0.05);

    // мягкий хрустальный обертон (октава выше, быстро затухает)
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, t);

    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.linearRampToValueAtTime(vol * 0.28, t + 0.008);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.35);

    osc2.connect(g2);
    g2.connect(target);
    osc2.start(t);
    osc2.stop(t + duration * 0.4);
  }

  /** Тихий звон бубенчика при нажатии на кнопку */
  playClick() {
    if (this.muted) return;
    this.bell(1318.5, 0, 0.22, 0.07);
    this.bell(1760, 0.03, 0.25, 0.05);
  }

  /** Нежный зимний перезвон при смене страницы */
  playSwoosh() {
    if (this.muted) return;
    const notes = [1046.5, 1174.66, 1318.51, 1567.98, 2093.0];
    notes.forEach((f, i) => this.bell(f, i * 0.065, 0.85, 0.075));
  }

  /** Волшебное открытие конверта */
  playEnvelopeOpen() {
    if (this.muted) return;
    // восходящий перелив челесты
    const arp = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51, 1567.98, 2093.0];
    arp.forEach((f, i) => this.bell(f, i * 0.085, 1.3, 0.11));
  }

  /** Торжественный тёплый аккорд, когда выехала открытка с именем */
  playRevealChord() {
    if (this.muted) return;
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chord.forEach((f, i) => this.bell(f, i * 0.045, 2.1, 0.12));
    // маленькая звёздная россыпь следом
    [2093, 2349.3, 2637.0, 3135.9].forEach((f, i) => this.bell(f, 0.38 + i * 0.07, 0.9, 0.055));
  }

  /** Открытие вишлиста */
  playWishlist() {
    if (this.muted) return;
    [783.99, 987.77, 1174.66, 1567.98].forEach((f, i) => this.bell(f, i * 0.055, 0.85, 0.09));
  }

  /** Пережеребьёвка */
  playShuffle() {
    if (this.muted) return;
    const notes = [659.25, 783.99, 698.46, 880, 783.99, 1046.5, 1318.51, 1567.98];
    notes.forEach((f, i) => this.bell(f, i * 0.06, 0.7, 0.1));
  }

  /** Мягкий звук ошибки */
  playError() {
    if (this.muted) return;
    this.bell(329.63, 0, 0.35, 0.11);
    this.bell(277.18, 0.11, 0.45, 0.11);
  }

  /** Неспешный зимний вальс, 78 ударов в минуту. */
  startMusic() {
    if (this.musicPlaying || this.muted) return;
    const ctx = this.ensure();
    if (!ctx || !this.musicBus) return;
    this.musicPlaying = true;
    this.noteIdx = 0;
    this.musicBus.gain.cancelScheduledValues(ctx.currentTime);
    this.musicBus.gain.setValueAtTime(0, ctx.currentTime);
    this.musicBus.gain.linearRampToValueAtTime(0.42, ctx.currentTime + 1.5);
    const beat = 60 / 78;
    let nextAt = ctx.currentTime + 0.08;
    const step = () => {
      if (!this.musicPlaying || this.muted) return;
      while (nextAt < ctx.currentTime + 0.3) {
        const index = this.noteIdx % 64;
        const phrase = Math.floor(index / 8);
        const note = index % 8;
        const offset = Math.max(0, nextAt - ctx.currentTime);
        this.piano(this.PHRASES[phrase][note], offset, beat * 1.7, 0.15);
        if (note % 4 === 0) {
          const chord = this.CHORDS[phrase];
          this.piano(chord[0], offset, beat * 3.8, 0.12);
          chord.slice(1).forEach((n, i) =>
            this.piano(n, offset + beat * (0.5 + i * 0.5), beat * 2.5, 0.065));
        }
        this.noteIdx++;
        nextAt += beat * 0.75;
      }
      this.musicTimer = window.setTimeout(step, 100);
    };
    step();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicBus && this.ctx) {
      this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicBus.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
    }
    if (this.musicTimer !== null) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.9, this.ctx.currentTime, 0.05);
    }
    if (this.muted) {
      this.stopMusic();
    } else {
      this.startMusic();
      this.playClick();
    }
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  unlockAndStartMusicIfAllowed() {
    if (this.muted) return;
    this.ensure();
    if (!this.musicPlaying) {
      this.startMusic();
    }
  }
}

export const sound = new HolidayAudio();
