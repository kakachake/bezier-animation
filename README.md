# bezier-animation

## Install

```bash
npm i bezier-animation
```

## Usage

### ES Module

```js
import BezierAnimation from "bezier-animation";
const box = new BezierAnimation({
  from: {
    top: 0,
  },
  to: {
    top: 200,
  },
  duration: 2000,
  onUpdate: (value) => {
    document.getElementById("box").style.top = value.top + "px";
  },
});
box.start();
```
