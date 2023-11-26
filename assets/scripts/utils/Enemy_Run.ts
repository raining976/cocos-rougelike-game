import { _decorator, Component, Node } from 'cc';
import StateBase from './StateBase';
const { ccclass, property } = _decorator;

@ccclass('Enemy_Run')
export default class Enemy_Run extends StateBase {
    onEnter(): void { 
        this._role.getAnim().play()
    }

    onExit(): void {
        this._role.getAnim().stop();
     }

    onUpdate(): void { }

    onKeyDown(event: any): void { }

    onKeyUp(event: any): void { }
}


