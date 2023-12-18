import { _decorator, Component, Node } from 'cc';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('SpinBall')
export class SpinBall extends Skill {
    start() {
        this.initSkill("SpinBall")
    }

    
}

