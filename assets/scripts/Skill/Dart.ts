import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, director, Director, IPhysics2DContact, macro, Node, RigidBody2D, tween, UITransform, Vec3 } from 'cc';
import { Skill } from './Skill';
import skillSettings from './SkillSettings';
import { Enemy } from '../Enemy/Enemy';
const { ccclass, property } = _decorator;

/**
 * 技能类的父类
 */
@ccclass('Skill')
export class Dart extends Skill {

    private speed: number = 0.001; //设置飞镖速度
    private targetNode: Node;    //追逐的目标
    private skillName: string = 'Dart';
  




    start() {

        //this.targetNode = this.getMinDisEnemy();
        //this.schedule(this.chasing, 0.2)        //未必使用
        this.init();
        this.initCollision();                   //碰撞注册
        this.autoDestroy();                     //自动销毁
    }

    chasing() {
        tween(this.node).
            to(1, {
                //相对坐标转换
                position: this.targetNode.worldPosition
            })
            .repeatForever()
            .start()

    }

    /**
     * 初始化技能设置
     */

    init() {
        let skillName = this.skillName
        this.id = skillSettings[skillName].id
        this.damage = skillSettings[skillName].damage
        this.skillLevel = skillSettings[skillName].skillLevel

    }


    /**
    * 获得距离最近的节点，如果返回的节点从画布上取下，则继续执行函数
    */
    getMinDisEnemy() {
        const canvas = director.getScene().getChildByName('Canvas');
        let enemies = canvas.children.filter(item => item.getComponent(Enemy) != null);

        let min = Infinity;
        let playerPos = this.node.worldPosition;
        let minDisNode: Node | null = null;

        // 循环直到找到有效的节点或 enemies 数组为空
        while (!minDisNode && enemies.length > 0) {
            let currentMin = Infinity;
            let currentMinNode: Node | null = null;

            enemies.forEach(item => {
                let dis = getDis(playerPos, item.worldPosition);
                if (dis < currentMin) {
                    currentMin = dis;
                    currentMinNode = item;
                }
            });

            if (currentMinNode) {
                minDisNode = currentMinNode;
            } else {
                // 如果当前循环中没有找到有效节点，可能是因为数组中的节点都被移除了，更新 enemies 数组
                enemies = canvas.children.filter(item => item.getComponent(Enemy) != null);
            }
        }

        // 求两 Node 距离的函数
        function getDis(a: Vec3, b: Vec3) {
            return a.subtract(b).length();
        }

        return minDisNode;
    }













    /**
     * 预制体销毁
     */
    autoDestroy() {
        //10s后自动删除飞镖
        setTimeout(() => {
            this.node && this.node.destroy();
        }, 10000);
    }


    /**
     * on方法注册碰撞事件，或者说是开始监听，以this.onBeginContact作为回调函数
     * @param 
     */
    initCollision() {
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            // 仅注册后开始碰撞
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    /**
     * 开始碰撞以后发生的事情, 碰撞事件发生在物理过程中，此过程无法删除节点
     * @param selfCollider: 碰撞主体
     * @param otherCollider: 碰撞体
     * @param contact: 碰撞相关信息，速度等
     */
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        if (otherCollider.tag === 1) {
            //敌人的Tag等于一
            director.once(Director.EVENT_AFTER_PHYSICS, () => {
                selfCollider.node.destroy();
            }, this)
        }
    }

    /**
     * 
     * @param selfCollider 
     * @param otherCollider 
     * @param contact 
     */
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }

    /**
     * use this method to find the closest enemy node
     */



}


