const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  duration: 4,
  fps: 60,
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

const sketch = ({ context, width, height }) => {
  const num = 40;
  let degrees = -35;
  const rects = [];

  const generateRects = () => {
    rects.length = 0;
    for (let i = 0; i < num; i++) {
      const x = random.range(0, width);
      const y = random.range(0, height);
      const w = random.range(200, 600);
      const h = random.range(40, 200);
      const fill = `rgba(255, ${Math.floor(
        random.range(0, 255),
      )}, 0, ${random.range(0.1, 0.5)})`;
      const stroke = 'black';
      rects.push({ x, y, w, h, fill, stroke });
    }
    // optionally change global skew each update
    degrees = random.range(-60, -20);
  };

  generateRects();
  const interval = setInterval(generateRects, 1500);

  // If you ever need to stop the interval when the sketch stops, expose a cleanup:
  // (canvas-sketch doesn't give a formal teardown here, but you can clear when needed)
  // process.on('exit', () => clearInterval(interval));

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      const { x, y, w, h, fill, stroke } = rect;
      context.save();
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.lineWidth = 2;
      context.fillStyle = fill;
      drawedSkewed({ context, w, h, degrees });
      context.fill();
      context.stroke();
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
