import { _decorator, AudioSource, Collider2D, Component, IPhysics2DContact, Node } from 'cc';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('StraightBall')
export class StraightBall extends Skill {
    audioSource: AudioSource;
    start() {
        this.initSkill("StraightBall")
        this.audioSource = this.node.getComponent(AudioSource);
    } 
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): void {
        this.audioSource.play();
    }
}

