import { _decorator, Component, Node, Animation } from 'cc';
import FSMState from './FSMState';
const { ccclass, property } = _decorator;

@ccclass('DeadState')
export class DeadState extends FSMState {
    onEnter(): void {
        let duration = this.stateComponent.getComponent(Animation).getState('dead').duration
        this.stateComponent.getComponent(Animation).play('dead')
        this.setManagerControl(false)
        setTimeout(() => {
            this.setManagerControl(true)
        }, duration * 1000);
    }
    onUpdate(): void {

    }
}

