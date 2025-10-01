import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import math from 'canvas-sketch-util/math';
import colorMap from 'colormap';

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
    // x += n;
    // y += n;
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
    context.strokeStyle = `rgba(255, ${Math.floor(
      random.range(0, 255),
    )}, 0, ${random.range(0.1, 0.5)})`;
    context.lineWidth = 4;

    points.forEach((point) => {
      const n = random.noise2D(
        point.ix + frame * 3,
        point.iy + frame,
        frequence,
        amplitude,
      );
      point.x = point.ix + n;
      point.y = point.iy + n;
    });

    let lastX, lastY;

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

        // if (!c) context.moveTo(point.x, point.y);
        // else context.lineTo(point.x, point.y);
        context.stroke();

        lastX = mx - (c / cols) * 250;
        lastY = my - (r / rows) * 250;
      }
    }

    // context.translate(cw * 0.5, ch * 0.5); to center

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
    this.color = color;

    this.ix = x;
    this.iy = y;
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
