import { _decorator, Component, Node, Vec3, tween, Tween } from 'cc';
import { Enemy } from '../../Enemy/Enemy';
import StateBase from './StateBase';
const { ccclass, property } = _decorator;

@ccclass('Storage')


export class Enemy_Run extends StateBase{
    constructor(role:Enemy,node:Node) {    
        super(role,node);
    }
    onEnter(){
        this._role.getanim().play("Run");//播放Run
        this._role.schedule(this._role.StateAI,this._role.interval);
    }
    onUpdate(){//执行寻路
        const targetnode: Node = this._role.targetnode;//目标节点
        const distance:number=this._role.distance;//与目标的距离
        const dir:Vec3=this._role.dir;//指向目标节点的单位向量
        if ((this._role.node.scale.x * dir.x) < 0) {//转向
            this._role.node.setScale(new Vec3(-this._role.node.scale.x, this._role.node.scale.y, this._role.node.scale.z));
        };
        let time = distance / this._role.getspeed();//到达时间=距离/速度
        if(this._role.getEnemyname()=="Onre"&&distance<300){
            time=time/2;
        }
        tween(this._role.node).to(time, { worldPosition: targetnode.worldPosition }, { easing: "linear" }).start();
    }
    onExit(){
        Tween.stopAllByTarget(this._ownnode);//停止缓动，否则无法设置position
        this._role.getanim().stop();
    }
 }
 
 export class Enemy_Attack extends StateBase{
    constructor(role:Enemy,node:Node) {    
        super(role,node); 
    }
    onEnter(){
        const attacktime=this._role.getanim().getState("Attack").duration;
        this._role.getanim().play("Attack");
        this._role.schedule(this._role.StateAI,attacktime);
    }
    onUpdate(){//之所以加update，是为了保证远程攻击敌人处于attack状态时可以切换朝向
        const dir:Vec3=this._role.dir;//指向目标节点的单位向量
        if ((this._role.node.scale.x * dir.x) < 0) {//转向
            this._role.node.setScale(new Vec3(-this._role.node.scale.x, this._role.node.scale.y, this._role.node.scale.z));
        };
    }
    onExit(){
        this._role.getanim().stop();
    }
 }
 
 export class Enemy_Shot extends StateBase{
    constructor(role:Enemy,node:Node) {    
        super(role,node); 
    }
    onEnter(){
        const shottime=this._role.getanim().getState("Shot").duration;
        this._role.getanim().play("Shot");
        this._role.schedule(this._role.StateAI,shottime);
    }
    onUpdate(){//之所以加update，是为了保证远程攻击敌人处于attack状态时可以切换朝向
        const targetnode: Node = this._role.targetnode;
        const dir:Vec3=this._role.dir;//指向目标节点的单位向量
        if ((this._role.node.scale.x * dir.x) < 0) {
            this._role.node.setScale(new Vec3(-this._role.node.scale.x, this._role.node.scale.y, this._role.node.scale.z));
        };
        this._role.ProjectileGenerate(targetnode.worldPosition);//执行射击
    }
    onExit(){
        this._role.getanim().stop();
    }
 }

 export class Enemy_Dead extends StateBase{
    constructor(role:Enemy,node:Node) {    
        super(role,node);
    }
    onEnter(){
        this._role.unschedule(this._role.StateAI);
        const deadtime=this._role.getanim().getState("Dead").duration;
        this._role.getanim().play("Dead");
        setTimeout(() => {
            this._role.onMonsterDeath()
            this._role.reclaim(); 
        }, deadtime*1000);
    }
    onExit(){
        this._role.getanim().stop();
    }
 }
 //统一导出
 export const Storage ={Enemy_Run, Enemy_Attack, Enemy_Shot, Enemy_Dead}

