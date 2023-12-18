import { _decorator, Component, Node ,Animation} from 'cc';
import FSMState from './FSMState';
const { ccclass, property } = _decorator;

@ccclass('RunState')
export class RunState extends FSMState {
    onEnter(): void {
        this.stateComponent.getComponent(Animation).play('run')
    }    

    onUpdate(): void {
        
    }

}

