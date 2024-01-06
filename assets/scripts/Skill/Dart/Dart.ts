import { _decorator, AudioSource, Collider2D, Component, Director, director, IPhysics2DContact, Node, tween } from 'cc';
import { Skill } from '../Skill';
import { SkillController } from '../SkillController';

const { ccclass, property } = _decorator;

@ccclass('Dart')
export class Dart extends Skill {

    private audioSource: AudioSource;
    start() {
        this.initCollision();
        this.audioSource = this.node.getComponent(AudioSource);
        this.initSkill("Dart")
    }


    /**
     * 开始碰撞以后发生的事情, 碰撞事件发生在物理过程中，此过程无法删除节点
     * @param selfCollider: 碰撞主体
     * @param otherCollider: 碰撞体
     * @param contact: 碰撞相关信息，速度等
     */

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    }
}



