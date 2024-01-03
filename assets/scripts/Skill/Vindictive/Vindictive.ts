import { _decorator, Component, Node } from 'cc';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('Vindictive')
export class Vindictive extends Skill {
    start() {
        this.initSkill("Vindictive");
    }

}


