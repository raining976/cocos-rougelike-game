import { _decorator, Component, Node } from 'cc';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('Dart')
export class Dart extends Skill {
    start() {
        this.initSkill("Dart")
    }
}

