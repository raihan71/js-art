# JS Art Project

This project demonstrates how to create art in JavaScript using the HTML5 Canvas and [canvas-sketch](https://github.com/mattdesl/canvas-sketch).

## Table of Contents

- [JS Art Project](#js-art-project)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
    - [Requirements](#requirements)
    - [Setup](#setup)
  - [Usage](#usage)
    - [Creating a New Sketch](#creating-a-new-sketch)
  - [Project Structure](#project-structure)
  - [License](#license)

## Introduction

This project explores techniques for generating creative visual art using JavaScript. The project leverages the Canvas API for drawing and [canvas-sketch](https://github.com/mattdesl/canvas-sketch) to simplify the setup and animation of your sketches. It serves as a starting point whether you're new to canvas or looking to push the boundaries of generative art.

## Installation

### Requirements

- Node.js (v12 or above)
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/js-art-project.git
cd js-art-project
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

## Usage

The project uses [canvas-sketch](https://github.com/mattdesl/canvas-sketch) to run sketches. To start a canvas-sketch, run:

## Workshop

- [Module Workshop](https://docs.google.com/document/d/1lGlk5kvkbLol7Z47pavC_KEXpVZ7Fmw4B6J7Xg21PrY/edit?usp=sharing)
- [Slides](https://www.canva.com/design/DAG0B9-LZZQ/7kjDm2VjJ2C540DggcC_ug/edit?utm_content=DAG0B9-LZZQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

```bash
npm start
# or
yarn start
```

This command invokes canvas-sketch's live-reload environment, which automatically reloads when you make changes to your code.

### Creating a New Sketch

1. Create a new JavaScript file, e.g., `sketch.js` with the following content:

```js
const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [800, 600],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Draw art:
    context.fillStyle = 'black';
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      context.beginPath();
      context.arc(x, y, 20, 0, Math.PI * 2, false);
      context.fill();
    }
  };
};

canvasSketch(sketch, settings);
```

2. Update your project’s `package.json` to include the new sketch if necessary, or modify your start script to run your new file:

```json
{
  "scripts": {
    "start": "canvas-sketch sketch.js --open"
  }
}
```

## Project Structure

A typical project structure looks like:

```
js-art-project/
├── node_modules/
├── sketches/
│   └── sketch.js
├── package.json
├── README.md
└── .gitignore
```

Feel free to create a `sketches` directory to organize multiple canvases and experiments.

## License

This project is open-sourced under the MIT License.
