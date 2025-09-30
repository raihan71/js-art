import canvasSketch from 'canvas-sketch';
import math from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import Color from 'canvas-sketch-util/color';
import risoColors from 'riso-colors';

const settings = {
  dimensions: [1080, 1080],
  // animate: true,
  // duration: 4,
  // fps: 60,
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h, fill, stroke, blend;

  const num = 40;
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
  ];

  const bgColor = random.pick(risoColors).hex;

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);

    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;
    blend = random.value() > 0.5 ? 'overlay' : 'source-over';
    rects.push({ x, y, w, h, fill, stroke, blend });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.beginPath();
    context.moveTo(0, -300);
    context.lineTo(300, 200);
    context.lineTo(-300, 200);
    context.closePath();
    context.lineWidth = 10;
    context.strokeStyle = 'black';
    context.stroke();
    context.clip();

    rects.forEach((rect) => {
      const { x, y, w, h, stroke, fill, blend } = rect;
      let shadowColor;
      context.save();
      context.translate(-width * 0.5, -height * 0.5);
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.lineWidth = 10;
      context.fillStyle = fill;
      context.globalCompositeOperation = blend;
      drawSkewed({ context, w, h, degrees });
      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5;
      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = 10;
      context.shadowOffsetY = 10;
      context.shadowBlur = 10;
      context.fill();
      context.shadowColor = null;
      context.stroke();
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 2;
      context.strokeStyle = random.pick(rectColors).hex;
      context.stroke();
      context.restore();
    });

    context.restore();
  };
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

const drawPolygon = (context, radius = 100, sides = 3) => {
  const slice = (Math.PI * 2) / sides;
  context.beginPath();
  context.moveTo(0, -radius);
  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI / 2;
    const x = Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius;
    context.lineTo(x, y);
  }
  context.closePath();
};

canvasSketch(sketch, settings);
