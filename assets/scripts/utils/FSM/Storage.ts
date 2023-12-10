import { _decorator, Component, Node, Vec3, tween, Tween } from 'cc';
import { Enemy } from '../../Enemy/Enemy';
import StateBase from './StateBase';
const { ccclass, property } = _decorator;

@ccclass('Storage')


export class Enemy_Run extends StateBase{
    constructor(role:Enemy,node:Node) {    
        super(role,node);
    // console.log('Enemy_Run has been successfully built');
    }
    onEnter(){
        this._role.getanim().play("Run");//播放Run
    }
    onUpdate(){//执行寻路
        const targetnode: Node = this._role.node.parent.getComponent("EnemySpawner").TargetNode;
        const distance = Vec3.distance(this._role.node.worldPosition, targetnode.worldPosition);
        const time = distance / this._role.getspeed();
        let temp = new Vec3();
        Vec3.subtract(temp, targetnode.worldPosition, this._role.node.worldPosition);
        temp.normalize();//归一化方向向量
        if ((this._role.node.scale.x * temp.x) < 0) {
            this._role.node.setScale(new Vec3(-this._role.node.scale.x, this._role.node.scale.y, this._role.node.scale.z));
        };
        Vec3.multiplyScalar(temp, temp, this._role.getattackrange());
        tween(this._role.node).to(time, { worldPosition: targetnode.worldPosition }, { easing: "linear" }).start();
        this._role.schedule(this._role.StateAI,this._role.interval);
    }
    onExit(){
        Tween.stopAllByTarget(this._ownnode);//停止缓动，否则无法设置position
        this._role.getanim().stop();
    }
 }
 
 export class Enemy_Attack extends StateBase{
    constructor(role:Enemy,node:Node) {    
        super(role,node); 
    // console.log('Enemy_Attack has been successfully built');
    }
    onEnter(){
        const attacktime=this._role.getanim().getState("Attack").duration;
        this._role.getanim().play("Attack");
        this._role.schedule(this._role.StateAI,attacktime);
    }
    onUpdate(){//之所以加update，是为了保证远程攻击敌人处于attack状态时可以切换朝向
        const targetnode: Node = this._role.node.parent.getComponent("EnemySpawner").TargetNode;
        const distance = Vec3.distance(this._role.node.worldPosition, targetnode.worldPosition);
        const time = distance / this._role.getspeed();
        let temp = new Vec3();
        Vec3.subtract(temp, targetnode.worldPosition, this._role.node.worldPosition);
        temp.normalize();//归一化方向向量
        if ((this._role.node.scale.x * temp.x) < 0) {
            this._role.node.setScale(new Vec3(-this._role.node.scale.x, this._role.node.scale.y, this._role.node.scale.z));
        };
    }
    onExit(){
        this._role.getanim().stop();
    }
 }
 
 export class Enemy_Dead extends StateBase{
    constructor(role:Enemy,node:Node) {    
        super(role,node);    
    // console.log('Enemy_Dead has been successfully built');
    }
    onEnter(){
        this._role.unschedule(this._role.StateAI);
        const deadtime=this._role.getanim().getState("Dead").duration;
        this._ownnode.getComponent("Enemy").getanim().play("Dead");
        setTimeout(() => {
            this._ownnode.getComponent("Enemy").onMonsterDeath()
            this._ownnode.getComponent("Enemy").reclaim(); 
        }, deadtime*1000);
    }
    onExit(){
        this._role.getanim().stop();
    }
 }
 //统一导出
 export const Storage ={Enemy_Run, Enemy_Attack, Enemy_Dead}

