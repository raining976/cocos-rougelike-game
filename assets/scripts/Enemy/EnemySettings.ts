import { _decorator, Component, Node, Prefab} from 'cc';
const { ccclass, property } = _decorator;
@ccclass('EnemySettings')
export class EnemySettings{
    [index:string]:{
        id:string,
        health:number,
        damage:number,
        speed:number,
        xpReward:number,
        remote:boolean,
        projectilerange:number,
        attackrange:number
        States:string[]
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
    health:100,
    damage:10,
    speed:40,
    xpReward:100,
    remote:true,
    projectilerange:500,
    attackrange:300,
    States:["Run","Attack","Dead","Shot"]
}
EnemyAttr['Yurei']={
    id:'005',
    health:100,
    damage:10,
    speed:40,
    xpReward:100,
    remote:false,
    projectilerange:-1,//没有远程攻击手段
    attackrange:1,
    States:["Run","Attack","Dead"]
}
EnemyAttr['Onre']={
    id:'006',
    health:100,
    damage:10,
    speed:40,
    xpReward:100,
    remote:false,
    projectilerange:-1,
    attackrange:1,
    States:["Run","Attack","Dead"]
}
EnemyAttr['Samurai']={
    id:'007',
    health:3000,
    damage:100,
    speed:40,
    xpReward:100,
    remote:false,
    projectilerange:-1,
    attackrange:1,
    States:["Run","Attack","Dead"]
}
EnemyAttr['Wizard']={
    id:'008',
    health:100,
    damage:10,
    speed:40,
    xpReward:100,
    remote:true,
    projectilerange:300,
    attackrange:-1,//没有近战手段
    States:["Run","Attack","Dead","Shot"]
}