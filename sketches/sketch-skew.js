const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  duration: 4,
  fps: 60,
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h, fill, stroke;

  const num = 40;
  const degrees = -35;
  const rects = [];

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);

    fill = `rgba(255, ${random.range(0, 255)}, ${random.range(
      0,
      255,
    )} , ${random.range(0.1, 0.5)})`;
    stroke = 'black';
    rects.push({ x, y, w, h, fill, stroke });
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      const { x, y, w, h } = rect;
      context.save();
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.lineWidth = 2;
      context.fillStyle = fill;
      drawedSkewed({ context, w, h, degrees });
      context.stroke();
      context.fill();
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

const drawedSkewed = ({ context, w = 600, h = 200, degrees = -45 }) => {
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
