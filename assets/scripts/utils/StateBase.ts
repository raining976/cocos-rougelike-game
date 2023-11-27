import { _decorator, Component, Node } from 'cc';
import { Enemy } from '../Enemy/Enemy';
import { EnemySettings } from '../Enemy/EnemySettings';
import { Player } from '../Player/Player';
const { ccclass, property } = _decorator;

@ccclass('StateBase')
/**状态基类，提供状态的逻辑接口 */
export default class StateBase {
    protected _role: Enemy| null = null;
    constructor(role:Enemy) {
        this._role = role;
    }
    //start------------虚方法-----------
    /**进入该状态时被调用 */
    onEnter() { }
    
    /**该状态每帧都会调用的方法 */
    onUpdate(dt: any) { }
    
    /**该状态监听的键盘输入事件 */
    onKeyDown(event: any) { }
    
    /**该状态监听的键盘弹起事件 */
    onKeyUp(event: any) { }
    
    /**离开该状态时调用 */
    onExit() { }
    //end--------------虚方法------------
}

