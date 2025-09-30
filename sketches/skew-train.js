import canvasSketch from 'canvas-sketch';
import math from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import Color from 'canvas-sketch-util/color';
import risoColors from 'riso-colors';

const seed = random.getRandomSeed();

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  name: seed,
  fps: 24,
};

const sketch = ({ context, width, height }) => {
  random.setSeed(seed);
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
  ];

  const bgColor = random.pick(risoColors).hex;

  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.5,
  };

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);

    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;
    blend = random.value() > 0.5 ? 'overlay' : 'source-over';
    // Each rectangle will have its own speed and vertical oscillation properties
    const speed = random.range(0.5, 5);
    const direction = random.value() > 0.5 ? 1 : -1;
    const initialY = y; // Store initial Y for oscillation
    const oscillationOffset = random.range(0, Math.PI * 2); // Offset for sine wave
    const oscillationAmplitude = random.range(20, 80); // How much it moves up and down
    const oscillationFrequency = random.range(0.01, 0.05); // How fast it oscillates
    rects.push({
      x,
      y,
      w,
      h,
      fill,
      stroke,
      blend,
      speed,
      direction,
      initialY,
      oscillationOffset,
      oscillationAmplitude,
      oscillationFrequency,
    });
  }

  return ({ context, width, height, time }) => {
    // Add 'time' to the sketch parameters
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(mask.x, mask.y);
    drawPolygon(context, mask.radius, mask.sides);

    context.clip();

    rects.forEach((rect) => {
      let {
        x,
        y,
        w,
        h,
        stroke,
        fill,
        blend,
        speed,
        direction,
        initialY,
        oscillationOffset,
        oscillationAmplitude,
        oscillationFrequency,
      } = rect;
      let shadowColor;

      // Update x position based on per-rectangle direction
      x += speed * direction;

      // Wrap around when rectangle goes off-screen in its movement direction
      if (direction > 0 && x > width) {
        x = -w; // Enter from left once it exits on the right
      } else if (direction < 0 && x < -w) {
        x = width; // Enter from right once it exits on the left
      }

      // Update y position for up and down movement using sine wave
      y =
        initialY +
        Math.sin(time * oscillationFrequency + oscillationOffset) *
          oscillationAmplitude;

      // Update the rect object with new x and y
      rect.x = x;
      rect.y = y;

      context.save();
      context.translate(-mask.x, -mask.y);
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

    context.save();
    context.translate(mask.x, mask.y);
    context.lineWidth = 10;
    drawPolygon(context, mask.radius - context.lineWidth, mask.sides);
    context.globalCompositeOperation = 'color-burn';
    context.strokeStyle = rectColors[0].hex;
    context.stroke();
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
