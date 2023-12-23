import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkillSettings')
export class SkillSettings {
    [skillName: string]: {
        /** 技能id 如果需要的话 */
        id: string,
        /** 技能名字 注意该名字与预制体实体类名字保持高度一致(不忽略大小写) */
        skillName: string,
        skillNameZh:string,
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
        /** 缩略图在resources文件夹中的相对位置 */
        imgPath:string,
        /** 缩略图 */
        imgSource:SpriteFrame,
        /** 技能升级的属性数组 */
        upgradeArray: Array<{
            description:string,
            [key:string]:any
        }>,
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
    skillNameZh:'只因球',
    skillLevel: 1,
    damage: 100,
    skillCount: 1,
    duration: 2, // 对于这个来说就是旋转一周的时间
    range: 100,
    releaseInterval: 500,
    imgPath:"EnhanceBoard/Skills/SpinBall/spriteFrame",
    imgSource:null,
    upgradeArray: [
        {
            description:"增加一个飞行物",
            skillCount:2,
        },
        {
            description:'',
            skillCount:3,
        },
        {
            description:'',
            skillCount:3,
        }
    ]
}

/**
 * 直线法球
 */
skillSettings['StraightBall'] = {
    id: '002',
    skillName: "StraightBall",
    skillNameZh:'魔法球',
    skillLevel: 1,
    damage: 100,
    skillCount: 1,
    duration: 1000, //
    range: 130, 
    releaseInterval: 2000,
    imgPath:"EnhanceBoard/Skills/StraightBall/spriteFrame",
    imgSource:null,
    upgradeArray: [
        {
            description:'飞行物增加一',
            skillCount:2
        },
        {
            description:'',
            skillCount:4,
        },
        {
            description:'',
            skillCount:5,
        }
    ]
}

/**
 * 轰炸
 */
skillSettings['Bomb'] = {
    id: '003',
    skillName: "Bomb",
    skillNameZh:"黑洞",
    skillLevel: 1,
    damage: 100,
    skillCount: 1,
    duration: 5000, // ms
    range: 600,
    releaseInterval: 5000,
    imgPath:"EnhanceBoard/Skills/Bomb/spriteFrame",
    imgSource:null,
    upgradeArray: [
        {
            description:'技能数量加1',
            skillCount: 2,
        },
        {
            description:'技能数量加1',
            skillCount: 3,
        },
    
    ]
}



