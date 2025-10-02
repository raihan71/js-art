import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import math from 'canvas-sketch-util/math';
import colorMap from 'colormap';

const AUDIO_OPTIONS = {
  src: 'assets/audio/mahalini-sisa-rasa.mp3', // Update to point at your MP3 file
  loop: true,
};

const audioAnalyser =
  typeof window !== 'undefined' ? createAudioAnalyser(AUDIO_OPTIONS) : null;

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  fps: 60,
};

const sketch = ({ width, height }) => {
  const cols = 72;
  const rows = 57;
  const numCells = cols * rows;

  const gw = width * 0.8;
  const gh = height * 0.8;

  const cw = gw / cols;
  const ch = gh / rows;

  const mx = (width - gw) * 0.5;
  const my = (height - gh) * 0.8;

  const points = [];

  let x, y, n, lineWidth, color;
  let frequence = 0.002;
  let amplitude = 120;

  const colors = colorMap({
    colormap: 'inferno',
    nshades: amplitude,
  });

  for (let i = 0; i < numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;

    n = random.noise2D(x, y, frequence, amplitude);
    lineWidth = math.mapRange(n, -amplitude, amplitude, 0, 5);
    color =
      colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];
    points.push(new Point({ x, y, lineWidth, color }));
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'rgb(0,0,0)';
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);
    context.translate(cw * 0.5, ch * 0.5);

    const audioLevel = audioAnalyser ? audioAnalyser.update() : 0;
    const amplitudeBoost = math.lerp(0.6, 3.2, audioLevel);
    const frameSpeed = math.lerp(1.5, 6, audioLevel);

    points.forEach((point) => {
      const n = random.noise2D(
        point.ix + frame * frameSpeed,
        point.iy + frame * 0.5,
        frequence,
        amplitude * amplitudeBoost,
      );
      point.x = point.ix + n;
      point.y = point.iy + n;
      point.updateLineWidth(audioLevel);
    });

    context.globalAlpha = math.lerp(0.3, 0.9, audioLevel);

    let lastX;
    let lastY;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const curr = points[r * cols + c + 0];
        const next = points[r * cols + c + 1];

        const mx = curr.x + (next.x - curr.x) * 0.8;
        const my = curr.y + (next.y - curr.y) * 1.5;

        if (!c) {
          lastX = curr.x;
          lastY = curr.y;
        }

        context.beginPath();
        context.lineWidth = curr.lineWidth;
        context.strokeStyle = curr.color;

        context.moveTo(lastX, lastY);
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
        context.stroke();

        lastX = mx - (c / cols) * 250;
        lastY = my - (r / rows) * 250;
      }
    }

    context.globalAlpha = 1;

    points.forEach((point) => {
      // point.draw(context);
    });

    context.restore();
  };
};

canvasSketch(sketch, settings);

class Point {
  constructor({ x, y, lineWidth, color }) {
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.baseLineWidth = Math.max(0.3, lineWidth);
    this.color = color;

    this.ix = x;
    this.iy = y;
  }

  updateLineWidth(level) {
    const scale = math.mapRange(level, 0, 1, 0.4, 3, true);
    const target = Math.max(0.5, this.baseLineWidth * scale);
    this.lineWidth = math.lerp(this.lineWidth, target, 0.2);
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'blue';

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}

function createAudioAnalyser(options = {}) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    console.warn('AudioContext not supported in this browser.');
    return null;
  }

  if (!options.src) {
    console.warn(
      'No audio source provided. Set AUDIO_OPTIONS.src to your MP3.',
    );
    return null;
  }

  const state = {
    ctx: null,
    analyser: null,
    data: null,
    level: 0,
    started: false,
    audio: null,
  };

  const start = async () => {
    state.ctx = new AudioContextClass();

    state.audio = new Audio();
    state.audio.src = options.src;
    state.audio.loop = options.loop !== false;
    state.audio.preload = 'auto';
    state.audio.crossOrigin = 'anonymous';

    const source = state.ctx.createMediaElementSource(state.audio);
    state.analyser = state.ctx.createAnalyser();
    state.analyser.fftSize = 512;
    state.analyser.smoothingTimeConstant = 0.85;
    state.data = new Uint8Array(state.analyser.frequencyBinCount);

    source.connect(state.analyser);
    state.analyser.connect(state.ctx.destination);

    await state.audio.play();
    console.info('Audio file playing — the sketch now reacts to it.');
  };

  const resumeContext = () => {
    if (state.ctx && state.ctx.state === 'suspended') {
      state.ctx.resume();
    }
  };

  const ensurePlaying = async () => {
    if (state.audio && state.audio.paused) {
      try {
        await state.audio.play();
      } catch (error) {
        console.warn(
          'Audio playback failed. User interaction may be required.',
          error,
        );
      }
    }
  };

  const handleGesture = async () => {
    if (state.started) {
      resumeContext();
      await ensurePlaying();
      return;
    }

    try {
      await start();
      state.started = true;
    } catch (error) {
      state.started = false;
      console.warn('Audio file could not be started.', error);
    }
  };

  const events = ['pointerdown', 'touchstart', 'keydown'];
  events.forEach((type) => {
    window.addEventListener(type, handleGesture);
  });

  console.info(
    'Interact (click, tap, or press a key) to let the sketch play the audio file.',
  );

  return {
    update() {
      if (!state.analyser) {
        return state.level;
      }

      resumeContext();
      ensurePlaying();

      state.analyser.getByteFrequencyData(state.data);

      let sum = 0;
      for (let i = 0; i < state.data.length; i++) {
        sum += state.data[i];
      }

      const average = sum / state.data.length / 255;
      state.level = math.lerp(state.level, average, 0.15);

      return state.level;
    },
  };
}
