import { Vec2, Vec3 } from 'cc';

/**
 * v2向量转v3
 * @param p vec2向量
 * @param z z分量大小 默认为零
 * @returns 
 */
export const V2toV3 = (p: Vec2, z:number = 0) => new Vec3(p.x, p.y, z)

// 节流 定时器 + 时间戳
export const throttle = (func: any, delay: number = 200) => {
    // 第一次触发时间戳
    let startTime = Date.now();
    return (...args: any[]) => {
      // 如果不是剪头函数可以使用arguments获取参数，这样就不用写形参了考虑形参个数了
      // let args = arguments;
      // 再次触发时间
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