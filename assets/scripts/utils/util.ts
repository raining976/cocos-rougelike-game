import { Vec2, Vec3 } from 'cc';

/**
 * v2向量转v3
 * @param p vec2向量
 * @param z z分量大小 默认为零
 * @returns 
 */
export const V2toV3 = (p: Vec2, z:number = 0) => new Vec3(p.x, p.y, z)

/**
 * 节流函数
 * @param func 要节流的函数 比如持续碰撞 注意此时传入的是回调函数 
 * @param delay 间隔执行时间 默认 1000 单位毫秒
 * @returns 
 */
export const throttle = (func: any, delay: number = 1000) => {
    let startTime = Date.now();
    return (...args: any[]) => {
      let curTime = Date.now();
      // 间隔时间 = 延迟的时间 - （再次触发时间戳 - 第一次触发时间戳）
      let interval = delay - (curTime - startTime);
      if (interval <= 0) {
        // 重新计算开始时间
        startTime = Date.now();
        return func(...args);
      }
    };
  };

/**
 * 函数防抖
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @param immediate 是否立即执行 默认不立即执行
 * @returns 
 */
export const debounce = (func, wait, immediate = false) => {

    let timeout;

    return function () {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout); // timeout 不为null
        if (immediate) {
            let callNow = !timeout; // 第一次会立即执行，以后只有事件执行后才会再次触发
            timeout = setTimeout(function () {
                timeout = null;
            }, wait)
            if (callNow) {
                func.apply(context, args)
            }
        }
        else {
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, wait);
        }
    }
}