import canvasSketch from 'canvas-sketch';
import math from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import risoColors from 'riso-colors';

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  duration: 4,
  fps: 60,
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h, fill, stroke;

  const num = 25;
  const degrees = -35;
  const rects = [];

  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
  ];

  const bgColor = random.pick(risoColors).hex;

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);

    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;
    rects.push({ x, y, w, h, fill, stroke });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      const { x, y, w, h, stroke, fill } = rect;
      context.save();
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.lineWidth = 10;
      context.fillStyle = fill;
      drawSkewed({ context, w, h, degrees });
      context.shadowColor = 'rgba(0,0,0,0.5)';
      context.shadowOffsetX = 10;
      context.shadowOffsetY = 20;
      context.shadowBlur = 10;
      context.fill();
      context.shadowColor = null;
      context.stroke();
      context.restore();
    });
  };

  // // context.beginPath();
  // // context.moveTo(0, 0);
  // // context.lineTo(w, 0);
  // // context.lineTo(w, h);
  // // context.lineTo(0, h);
  // // context.closePath();
  // // context.stroke();
  // context.beginPath();
  // context.moveTo(0, 0);
  // context.lineTo(rx, ry);
  // context.lineTo(rx, ry + h);
  // context.lineTo(0, h);
  // context.closePath();
  // context.stroke();

  // context.restore();
};

const drawSkewed = ({ context, w = 600, h = 200, degrees = -45 }) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();

  context.restore();
};

canvasSketch(sketch, settings);
