import { _decorator, } from 'cc';
import FSMState from './FSMState';
const { ccclass} = _decorator;

@ccclass('HurtState')
export class HurtState extends FSMState {
     isNeedControl: boolean = true;
}

