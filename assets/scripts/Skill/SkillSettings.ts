import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkillSettings')
class SkillSettings {
    [skillName: string]: {
        /** 技能id 如果需要的话 */
        id: string,
        /** 技能名字 注意该名字与预制体实体类名字保持高度一致(不忽略大小写) */
        skillName: string,
        /** 技能等级 */
        skillLevel: number,
        /** 技能伤害 */
        damage: number,
        /** 技能数量  根据需要添加 */
        skillCount: number,
        /** 技能持续时间(技能释放速度) 秒 */
        duration: number,
        /** 技能范围 */
        range: number,
        /** 技能释放间隔 毫秒 */
        releaseInterval: number,
        /** 技能升级的属性数组 */
        upgradeArray: Array<Object>,
    }
}



/**
 * 技能相关设置
 */
export const skillSettings = new SkillSettings();

/**
 * 旋转篮球
 */
skillSettings['SpinBall'] = {
    id: '001',
    skillName: "SpinBall",
    skillLevel: 1,
    damage: 100,
    skillCount: 1,
    duration: 2, // 对于这个来说就是旋转一周的时间
    range: 100,
    releaseInterval: 500,
    upgradeArray: [
        {
            description:"增加一个飞行物",
            skillCount:2,
        },
        {
            damage: 110,
        },
        {
            range: 110,
        }
    ]
}

/**
 *  追踪飞镖
 */
skillSettings['Dart'] = {
    id: '002',
    skillName: "Dart",
    skillLevel: 1,
    damage: 20,
    skillCount: 5,   //对飞镖来说是发射的飞镖数量
    duration: 200,   //对飞镖来说是技能速度, 每秒移动50
    range: 2000,     //对飞镖来说是销毁的范围，超出多少范围销毁
    releaseInterval: 500,
    upgradeArray: [
        {
            skillCount:2,
        },
    ]

}



