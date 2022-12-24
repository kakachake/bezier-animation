# easy-bezier-animation

## Install

```bash
npm i easy-bezier-animation
```

## Usage

### ES Module

```js
import BezierAnimation from "easy-bezier-animation";
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

### Browser

```html
<script src="https://unpkg.com/easy-bezier-animation"></script>
<script>
  const box = new BezierAnimation({
    from: {
      top: 31,
    },
    to: {
      top: 200,
    },
    duration: 2000,
    onUpdate: (value) => {
      console.log(value);
      document.getElementById("box").style.top = value.top + "px";
    },
  });
  box.start();
</script>
```

## API

### new BezierAnimation(Opitons)

#### Options

| Name       | Type                    | Default | Description                                                          |
| ---------- | ----------------------- | ------- | -------------------------------------------------------------------- |
| from       | `Object`                | {}      | The initial value of the animation                                   |
| to         | `Object`                | {}      | The final value of the animation                                     |
| duration   | `Number`                | -       | The duration of the animation                                        |
| easing     | `Easing\|[x1,y1,x2,y2]` | -       | The easing function of the animation                                 |
| onUpdate   | `Function`              | -       | The callback function that is called when the animation is updated   |
| onComplete | `Function`              | -       | The callback function that is called when the animation is completed |

#### Easing

| Name           | Easing Function |
| -------------- | --------------- |
| linear         | linear          |
| ease           | ease            |
| ease-in        | ease-in         |
| ease-out       | ease-out        |
| ease-in-out    | ease-in-out     |
| easeInSine     | easeInSine      |
| easeOutSine    | easeOutSine     |
| easeInOutSine  | easeInOutSine   |
| easeInQuad     | easeInQuad      |
| easeOutQuad    | easeOutQuad     |
| easeInOutQuad  | easeInOutQuad   |
| easeInCubic    | easeInCubic     |
| easeOutCubic   | easeOutCubic    |
| easeInOutCubic | easeInOutCubic  |
| easeInQuart    | easeInQuart     |
| easeOutQuart   | easeOutQuart    |
| easeInOutQuart | easeInOutQuart  |
| easeInQuint    | easeInQuint     |
| easeOutQuint   | easeOutQuint    |
| easeInOutQuint | easeInOutQuint  |
| easeInExpo     | easeInExpo      |
| easeOutExpo    | easeOutExpo     |
| easeInOutExpo  | easeInOutExpo   |
| easeInCirc     | easeInCirc      |
| easeOutCirc    | easeOutCirc     |
| easeInOutCirc  | easeInOutCirc   |
| easeInBack     | easeInBack      |
| easeOutBack    | easeOutBack     |
| easeInOutBack  | easeInOutBack   |
