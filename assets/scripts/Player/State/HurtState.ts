import { _decorator, Component, Node ,Animation} from 'cc';
import FSMState from './FSMState';
const { ccclass, property } = _decorator;

@ccclass('HurtState')
export class HurtState extends FSMState {
    onEnter(){
        let duration = this.stateComponent.getComponent(Animation).getState('hurt').duration
        this.stateComponent.getComponent(Animation).play('hurt')
        this.setManagerControl(false)
        setTimeout(() => {
            this.setManagerControl(true)
        }, duration*1000);

    }
}

