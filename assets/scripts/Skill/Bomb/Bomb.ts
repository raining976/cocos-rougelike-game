import { _decorator, AudioSource, Collider2D, Component, IPhysics2DContact, Node } from 'cc';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('Bomb')
export class Bomb extends Skill { 
    private audioSource: AudioSource;
    start() {
        this.audioSource = this.node.getComponent(AudioSource);
        this.initSkill('Bomb')
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): void {
    }
}


