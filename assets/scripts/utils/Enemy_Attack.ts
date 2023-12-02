import { _decorator, Component, Node } from 'cc';
import StateBase from './StateBase';
const { ccclass, property } = _decorator;

@ccclass('Enemy_Attack')
export default class Enemy_Run extends StateBase {
    onEnter(): void { }

    onExit(): void { }

    onUpdate(dt: any): void { }

    onKeyDown(event: any): void { }

    onKeyUp(event: any): void { }
}