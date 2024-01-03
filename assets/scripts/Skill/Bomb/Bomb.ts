import { _decorator, Component, Node } from 'cc';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('Bomb')
export class Bomb extends Skill { 
    start() {
        this.initSkill('Bomb')
    }
}


