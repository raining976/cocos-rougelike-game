import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, director, Director, IPhysics2DContact, macro, Node, RigidBody2D, tween, UITransform, Vec3 } from 'cc';
import { Skill } from './Skill';
import { skillAttr } from './SkillSettings';
import { Enemy } from '../Enemy/Enemy';
const { ccclass, property } = _decorator;

/**
 * 技能类的父类
 */
@ccclass('Skill')
export class Dart extends Skill {

    private speed: number = 0.001; //设置飞镖速度
    private targetNode: Node;    //追逐的目标


    async start() {
    

        //获得最近距离的敌人节点
        await this.getMinDisNode(this.getMinDisEnemy())
        .then(res=>{
            this.targetNode = res
        })
        this.schedule(this.chasing, 0.5)
        this.initSkillSettings();               //初始化技能配置
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
    update() {

    }
    /**
     * 根据属性组，初始化技能属性
     */
    initSkillSettings() {
        //该方法会被子技能继承，因此this在实际上应该指的是具体的技能脚本, 挂载技能预制体上
        let prefabName = this.node.name;
        this.id = skillAttr[prefabName].id;
        this.damage = skillAttr[prefabName].damage;
        this.skillLevel = skillAttr[prefabName].skillLevel;
        this.skillLogic = skillAttr[prefabName].skillLogic;

    }

    getMinDisNode(cb){
        return new Promise((resolve,reject)=>{
            resolve(cb);
        })
    }
    /**
     *  获得距离最近的节点
     */
    getMinDisEnemy() {
        const canvas = director.getScene().getChildByName('Canvas');//获得画布
        //enemies是所有挂载的怪物节点，enemies数组是会变化的
        const enemies = canvas.children.filter(item => item.getComponent(Enemy) != null);

        let min = Infinity;
        let playerPos = this.node.position;
        let minDis: Vec3;
        let minDisNode: Node;
        //获得最近距离的节点
        enemies.forEach(item => {
            let dis = getDis(playerPos, item.position);
            if (dis < min) {
                min = dis;
                minDisNode = item
            }

        })

        //求两Node距离的函数
        function getDis(a: Vec3, b: Vec3) {
            return (a.subtract(b).length());
        }
        if (!minDisNode) {
            minDisNode = this.getMinDisEnemy()
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
            director.once(Director.EVENT_AFTER_PHYSICS, () =>{
                selfCollider.node.destroy();
            },this)
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







}



