import { _decorator, Component, Node } from 'cc';
import StateBase from './StateBase';
const { ccclass, property } = _decorator;

@ccclass('Animator')
/**动画机类，用于管理单个角色的状态 */
export default class Animator {
    protected _mapStates: Map<string, StateBase> = new Map();   //角色状态集合
    protected _state: StateBase | null = null;                  //角色当前状态

    /**
     * 注册状态
     * @param key 状态名
     * @param state 状态对象
     * @returns 
     */
    regState(key: string, state: StateBase): void {
        if ('' === key) {
            return;
        }
        if (null == state) {
            return;
        }
        if (this._mapStates.has(key))
            return;

        
        this._mapStates.set(key, state);
    }

    /**
     * 删除状态
     * @param key 状态名
     * @returns 
     */
    delState(key: string): void {
        if ('' === key) {
            return;
        }

        this._mapStates.delete(key);
    }

    /**
     * 切换状态
     * @param key 状态名
     * @returns 
     */
    switchState(key: string) {
        if ('' === key) {
            return;
        }

        if (this._state) {
            if (this._state == this._mapStates.get(key))
                return;
            this._state.onExit();
        }
        this._state = this._mapStates.get(key);
        if (this._state){
            this._state.onEnter();
        }
        return
    }

    /**获取状态机内所有状态 */
    getStates(): Map<string, StateBase> {
        return this._mapStates;
    }

    /**获取当前状态 */
    getCurrentState(): StateBase {
        return this._state;
    }

    /**当前状态更新函数 */
    onUpdate() {
        if (!this._state) {
            return;
        }
        if (!this._state.onUpdate) {
            return;
        }
        this._state.onUpdate();
    }
}
