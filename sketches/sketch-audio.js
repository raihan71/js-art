import canvasSketch from 'canvas-sketch';
import math from 'canvas-sketch-util/math';

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;

const sketch = () => {
  const bin = [4, 2, 17];
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);

    for (let i = 0; i < bin.length; i++) {
      const item = bin[i];
      const mapped = math.mapRange(
        audioData[item],
        analyserNode.minDecibels,
        analyserNode.maxDecibels,
        0,
        1,
        true,
      );
      const radius = mapped * 400;

      context.save();
      context.translate(width * 0.5, height * 0.5);
      context.lineWidth = 10;

      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = `hsl(${item * 20}, 100%, 50%)`;
      context.stroke();

      context.shadowBlur = 10;
      context.shadowColor = 'black';
      context.restore();
    }
  };
};

const addListerner = () => {
  window.addEventListener('mouseup', async () => {
    if (!audioContext) createAudio();

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    if (audio.paused) {
      audio.play();
      manager.play();
    } else {
      audio.pause();
      manager.pause();
    }
  });
};

const createAudio = () => {
  audio = document.createElement('audio');
  audio.src = 'audio/mahalini-sisa-rasa.mp3';

  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

const getAverage = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return sum / data.length;
};

const startAudio = async () => {
  addListerner();

  manager = await canvasSketch(sketch, settings);
  manager.pause();
};

startAudio();
