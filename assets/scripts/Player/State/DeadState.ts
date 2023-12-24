import { _decorator, Component, Node, Animation } from 'cc';
import FSMState from './FSMState';
const { ccclass, property } = _decorator;

@ccclass('DeadState')
export class DeadState extends FSMState {
     isNeedControl: boolean = true;
}

