import { _decorator, Component, Node } from 'cc';
import Animator from './Animator';
const { ccclass, property } = _decorator;

@ccclass('AnimatorManager')
/**动画机管理器 */
export default class AnimatorManager {
    //单例
    private static _instance: AnimatorManager | null = null;
    public static instance(): AnimatorManager {
        if (!this._instance) {
            this._instance = new AnimatorManager();
        }
        return this._instance;
    }

    private _mapAnimators: Map<string, Animator> = new Map<string, Animator>();

    /**
     * 获取动画机，若不存在则新建并返回
     * @param key 动画机名
     * @returns 动画机
     */
    getAnimator(key: string): Animator | null {
        // if ("" == key) {
        // }

        // let anim: Animator | null = null;
        // if (!this._mapAnimators.has(key)) {
        //     anim = new Animator();
        //     this._mapAnimators.set(key, new Animator());
        // }
        // else {
        //     anim = this._mapAnimators.get(key);
        // }
        
        return new Animator();
    }

    /**
     * 删除动画机
     * @param key 动画机名
     */
    delAnimator(key: string) {
        this._mapAnimators.delete(key);
    }

    /** 清空动画机 */
    clearAnimator() {
        this._mapAnimators.clear();
    }

    /**动画机状态更新 */
    onUpdate() {
        this._mapAnimators.forEach((value: Animator, key: string) => {
            value.onUpdate();
        });
    }
}


