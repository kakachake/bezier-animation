import { defaultBezier } from "./bezier";
export type DefaultBezier = keyof typeof defaultBezier;
export type BezierOption = DefaultBezier | [x1: number, y1: number, x2: number, y2: number];
export type BezierAnimationConfig<T extends Record<string, number> = any> = {
    /**
     * 动画开始的值
     * default: -
     */
    from: T;
    /**
     * 动画结束的值
     * default: -
     */
    to: T;
    /**
     * 动画持续时间
     * default: -
     */
    duration: number;
    /**
     * 动画曲线
     * default: ease
     */
    easing?: BezierOption;
    /**
     * 动画延迟
     * default: 0
     */
    delay?: number;
    /**
     * 动画循环
     * default: false
     */
    loop?: boolean | number;
    /**
     * 动画每帧回调
     * default: -
     */
    onUpdate?: (T: any) => void;
    /**
     * 动画结束回调
     * default: -
     */
    onComplete?: (T: any) => void;
};
