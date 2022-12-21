import { createBezier } from "./bezier";
import { BezierOption, EasyAnimationConfig } from "./type";

const defaultConfig: Partial<EasyAnimationConfig> = {
  easing: "ease",
  delay: 0,
  loop: 5,
};

function isNull(obj: any) {
  return (
    obj === null ||
    obj === undefined ||
    (typeof obj === "object" && Object.keys(obj).length === 0)
  );
}

function hasSameKeys<T extends Record<string, number>>(
  obj1: T,
  obj2: T
): boolean {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }
  for (let i = 0; i < obj1Keys.length; i++) {
    if (obj1Keys[i] !== obj2Keys[i]) {
      return false;
    }
  }
  return true;
}

export default function EasyAnimation<T extends Record<string, number>>(
  userConfig: EasyAnimationConfig<T>
) {
  const config = { ...userConfig, ...defaultConfig };
  const { from, to, duration, easing, delay, onUpdate, onComplete } = config;

  let loop = config.loop;

  let totalTime = 0;

  let timer = null;

  if (isNull(from) || isNull(to)) {
    throw new Error("from or to must be provided as an object");
  }
  if (!hasSameKeys(from, to)) {
    throw new Error("from and to must have the same keys");
  }

  this.bezier = createBezier(easing);

  this.update = (per: number, onUpdate: (opt: T) => void) => {
    const keys = Object.keys(from);
    const opt: any = {};
    keys.forEach((key) => {
      const [fromVal, toVal] = [from[key], to[key]];
      const out = this.bezier(per);
      opt[key] = fromVal + out * (toVal - fromVal);
    });
    onUpdate(opt);
  };

  this.stop = () => {
    window.cancelAnimationFrame(timer);
  };

  this.start = () => {
    window.cancelAnimationFrame(timer);
    totalTime = 0;
    _start();
  };

  this.continue = () => {
    _start();
  };

  const _start = () => {
    let lastTime = +new Date();

    const step = (cb: (opt: T) => void) => {
      let newTime = +new Date();
      const time = newTime - lastTime;
      lastTime = newTime;
      totalTime += time;

      if (totalTime > duration) {
        return false;
      }
      this.update(totalTime / duration, cb);
      return true;
    };

    const callback = (opt: T) => {
      onUpdate && onUpdate(opt);
      timer = window.requestAnimationFrame(() => {
        const res = step(callback);
        if (!res) {
          onComplete && onComplete(opt);
          if (loop) {
            if (typeof loop === "number") {
              if (loop > 1) {
                loop--;
                this.start();
              }
            } else {
              this.start();
            }
          }
        }
      });
    };

    step(callback);
  };

  this.setBezier = (easing: BezierOption) => {
    this.bezier = createBezier(easing);
  };
}
