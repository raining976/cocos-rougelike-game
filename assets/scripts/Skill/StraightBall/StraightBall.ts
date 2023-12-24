import { _decorator, Component, Node } from 'cc';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('StraightBall')
export class StraightBall extends Skill {
    start() {
        this.initSkill("StraightBall")
    } 
}

