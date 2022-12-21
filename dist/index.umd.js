(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EasyAnimation = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function cubicBezier(p1x, p1y, p2x, p2y) {
        var ZERO_LIMIT = 1e-6;
        // Calculate the polynomial coefficients,
        // implicit first and last control points are (0,0) and (1,1).
        var ax = 3 * p1x - 3 * p2x + 1;
        var bx = 3 * p2x - 6 * p1x;
        var cx = 3 * p1x;
        var ay = 3 * p1y - 3 * p2y + 1;
        var by = 3 * p2y - 6 * p1y;
        var cy = 3 * p1y;
        function sampleCurveDerivativeX(t) {
            // `ax t^3 + bx t^2 + cx t` expanded using Horner's rule
            return (3 * ax * t + 2 * bx) * t + cx;
        }
        function sampleCurveX(t) {
            return ((ax * t + bx) * t + cx) * t;
        }
        function sampleCurveY(t) {
            return ((ay * t + by) * t + cy) * t;
        }
        // Given an x value, find a parametric value it came from.
        function solveCurveX(x) {
            var t2 = x;
            var derivative;
            var x2;
            // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
            // first try a few iterations of Newton's method -- normally very fast.
            // http://en.wikipedia.org/wikiNewton's_method
            for (var i = 0; i < 8; i++) {
                // f(t) - x = 0
                x2 = sampleCurveX(t2) - x;
                if (Math.abs(x2) < ZERO_LIMIT) {
                    return t2;
                }
                derivative = sampleCurveDerivativeX(t2);
                // == 0, failure
                /* istanbul ignore if */
                if (Math.abs(derivative) < ZERO_LIMIT) {
                    break;
                }
                t2 -= x2 / derivative;
            }
            // Fall back to the bisection method for reliability.
            // bisection
            // http://en.wikipedia.org/wiki/Bisection_method
            var t1 = 1;
            /* istanbul ignore next */
            var t0 = 0;
            /* istanbul ignore next */
            t2 = x;
            /* istanbul ignore next */
            while (t1 > t0) {
                x2 = sampleCurveX(t2) - x;
                if (Math.abs(x2) < ZERO_LIMIT) {
                    return t2;
                }
                if (x2 > 0) {
                    t1 = t2;
                }
                else {
                    t0 = t2;
                }
                t2 = (t1 + t0) / 2;
            }
            // Failure
            return t2;
        }
        function solve(x) {
            return sampleCurveY(solveCurveX(x));
        }
        return solve;
    }
    // Default named bezier values
    var defaultBezier = {
        ease: cubicBezier(0.25, 0.1, 0.25, 1),
        easeIn: cubicBezier(0.42, 0, 1, 1),
        easeOut: cubicBezier(0, 0, 0.58, 1),
        easeInOut: cubicBezier(0.42, 0, 0.58, 1),
        linear: cubicBezier(0, 0, 1, 1),
    };
    function easePercentage(bezier, percentage) {
        if (typeof bezier === "string") {
            percentage = defaultBezier[bezier](percentage);
        }
        else {
            var p1x = bezier[0], p1y = bezier[1], p2x = bezier[2], p2y = bezier[3];
            percentage = cubicBezier(p1x, p1y, p2x, p2y)(percentage);
        }
        return percentage;
    }
    function createBezier(bezier) {
        console.log(bezier);
        return function (t) { return easePercentage(bezier, t); };
    }

    var defaultConfig = {
        easing: "ease",
        delay: 0,
        loop: false,
    };
    function isNull(obj) {
        return (obj === null ||
            obj === undefined ||
            (typeof obj === "object" && Object.keys(obj).length === 0));
    }
    function hasSameKeys(obj1, obj2) {
        var obj1Keys = Object.keys(obj1);
        var obj2Keys = Object.keys(obj2);
        if (obj1Keys.length !== obj2Keys.length) {
            return false;
        }
        for (var i = 0; i < obj1Keys.length; i++) {
            if (obj1Keys[i] !== obj2Keys[i]) {
                return false;
            }
        }
        return true;
    }
    function EasyAnimation(userConfig) {
        var _this = this;
        var config = __assign(__assign({}, userConfig), defaultConfig);
        var from = config.from, to = config.to, duration = config.duration, easing = config.easing; config.delay; var onUpdate = config.onUpdate, onComplete = config.onComplete;
        var loop = config.loop;
        var totalTime = 0;
        var timer = null;
        if (isNull(from) || isNull(to)) {
            throw new Error("from or to must be provided as an object");
        }
        if (!hasSameKeys(from, to)) {
            throw new Error("from and to must have the same keys");
        }
        this.bezier = createBezier(easing);
        this.update = function (per, onUpdate) {
            var keys = Object.keys(from);
            var opt = {};
            keys.forEach(function (key) {
                var _a = [from[key], to[key]], fromVal = _a[0], toVal = _a[1];
                var out = _this.bezier(per);
                opt[key] = fromVal + out * (toVal - fromVal);
            });
            onUpdate(opt);
        };
        this.stop = function () {
            window.cancelAnimationFrame(timer);
        };
        this.start = function () {
            window.cancelAnimationFrame(timer);
            totalTime = 0;
            _start();
        };
        this.continue = function () {
            _start();
        };
        var _start = function () {
            var lastTime = +new Date();
            var step = function (cb) {
                var newTime = +new Date();
                var time = newTime - lastTime;
                lastTime = newTime;
                totalTime += time;
                if (totalTime > duration) {
                    return false;
                }
                _this.update(totalTime / duration, cb);
                return true;
            };
            var callback = function (opt) {
                onUpdate && onUpdate(opt);
                timer = window.requestAnimationFrame(function () {
                    var res = step(callback);
                    if (!res) {
                        onComplete && onComplete(opt);
                        if (loop) {
                            if (typeof loop === "number") {
                                if (loop > 1) {
                                    loop--;
                                    _this.start();
                                }
                            }
                            else {
                                _this.start();
                            }
                        }
                    }
                });
            };
            step(callback);
        };
        this.setBezier = function (easing) {
            _this.bezier = createBezier(easing);
        };
    }

    return EasyAnimation;

}));
