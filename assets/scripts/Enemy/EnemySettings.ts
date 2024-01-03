import { _decorator, Component, Node, Prefab} from 'cc';
const { ccclass, property } = _decorator;
@ccclass('EnemySettings')
export class EnemySettings{
    [index:string]:{
        id:string,
        /**怪物血量 */
        health:number,
        /**怪物伤害 */
        damage:number,
        /**怪物速度 */
        speed:number,
        /**怪物经验 */
        xpReward:number,
        /**怪物是否为远程攻击 */
        remote:boolean,
        /**怪物射程 */
        projectilerange:number,
        /**怪物攻击范围 */
        attackrange:number
        /**怪物状态列表 */
        States:string[]
        /**怪物初始权重，在调用模块中不可改动，但是调用模块可再自定义权重对最终权重进行调节
         * 随便写，不用凑总和为1
         */
        weight:number
    }
};
export const EnemyAttr=new EnemySettings();
// EnemyAttr['Bat']={
//     id:'001',
//     health:100,
//     damage:100,
//     speed:200,
//     xpReward:100,
//     attackrange:100,
//     States:["Run"]
// }
// EnemyAttr['FlyWorm']={
//     id:'002',
//     health:100,
//     damage:100,
//     speed:300,
//     xpReward:100,
//     attackrange:100,
//     States:["Run"]
// }
// EnemyAttr['BossStoneGolem']={
//     id:'003',
//     health:1000,
//     damage:1000,
//     speed:1000,
//     xpReward:1000,
//     attackrange:300,
//     States:["Run"]
// }
EnemyAttr['Archer']={
    id:'004',
    health:10,
    damage:10,
    speed:40,
    xpReward:100,
    remote:true,
    projectilerange:500,
    attackrange:300,
    States:["Run","Attack","Dead","Shot"],
    weight:0.3
}
EnemyAttr['Yurei']={
    id:'005',
    health:10,
    damage:10,
    speed:40,
    xpReward:100,
    remote:false,
    projectilerange:-1,//没有远程攻击手段
    attackrange:1,
    States:["Run","Attack","Dead"],
    weight:1
}
EnemyAttr['Onre']={
    id:'006',
    health:10,
    damage:10,
    speed:40,
    xpReward:100,
    remote:false,
    projectilerange:-1,
    attackrange:1,
    States:["Run","Attack","Dead"],
    weight:1
}
EnemyAttr['Samurai']={
    id:'007',
    health:300,
    damage:100,
    speed:40,
    xpReward:100,
    remote:false,
    projectilerange:-1,
    attackrange:1,
    States:["Run","Attack","Dead"],
    weight:0//不知道为什么这个预制体实例化会爆错...抽象
}
EnemyAttr['Wizard']={
    id:'008',
    health:10,
    damage:10,
    speed:40,
    xpReward:100,
    remote:true,
    projectilerange:300,
    attackrange:-1,//没有近战手段
    States:["Run","Attack","Dead","Shot"],
    weight:0.3
}