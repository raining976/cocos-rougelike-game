import { _decorator, Component, Node, AudioSource, Collider2D, IPhysics2DContact } from 'cc';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('SpinBall')
export class SpinBall extends Skill {

    attackAudio: AudioSource;
    start() {
        this.initSkill("SpinBall")
        this.attackAudio = this.node.getComponent(AudioSource);
        this.initCollision();
    }

    
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 1) {
            this.attackAudio.play();
        }
    }
}

