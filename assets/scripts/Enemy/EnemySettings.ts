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
        attackrange:number
    }
};
export const EnemyAttr=new EnemySettings();
EnemyAttr['Bat']={
    id:'001',
    health:100,
    damage:100,
    speed:200,
    xpReward:100,
    attackrange:100
}
EnemyAttr['FlyWorm']={
    id:'002',
    health:100,
    damage:100,
    speed:300,
    xpReward:100,
    attackrange:100
}
EnemyAttr['BossStoneGolem']={
    id:'003',
    health:1000,
    damage:1000,
    speed:1000,
    xpReward:1000,
    attackrange:300
}

