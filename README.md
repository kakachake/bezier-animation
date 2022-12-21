# easy-animation

## Install

```bash
npm i easy-animation
```

## Usage

### ES Module

```js
import EasyAnimation from "easy-animation";
const box = new EasyAnimation({
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
