import { Vec2, Vec3 } from 'cc';

/**
 * v2向量转v3
 * @param p vec2向量
 * @param z z分量大小 默认为零
 * @returns 
 */
export const V2toV3 = (p: Vec2, z:number = 0) => new Vec3(p.x, p.y, z)

/**
 * 函数节流
 * @param fn 要节流的函数
 * @param delay 间隔执行的时间 毫秒
 * @returns 
 */
export const throttled = (fn, delay) => {
    let timer = null
    let starttime = Date.now()
    return function () {
        let curTime = Date.now() // 当前时间
        let remaining = delay - (curTime - starttime)  // 从上一次到现在，还剩下多少多余时间
        let context = this
        let args = arguments
        clearTimeout(timer)
        if (remaining <= 0) {
            fn.apply(context, args)
            starttime = Date.now()
        } else {
            timer = setTimeout(fn, remaining);
        }
    }
}

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