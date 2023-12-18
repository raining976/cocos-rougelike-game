import { _decorator, Component, Node,Animation } from 'cc';
import FSMState from './FSMState';
const { ccclass, property } = _decorator;

@ccclass('IdleState')
export class IdleState extends FSMState{
    onEnter(): void {
        this.stateComponent.getComponent(Animation).play('idle');
    }
    onUpdate(): void {
        
    }
}

