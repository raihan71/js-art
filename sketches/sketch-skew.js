const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h;
  const num = 40;
  const degrees = -35;
  const rects = [];

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);
    rects.push({ x, y, w, h });
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      const { x, y, w, h } = rect;
      context.save();
      context.translate(x, y);
      context.strokeStyle = 'blue';
      drawedSkewed({ context, w, h, degrees });
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
