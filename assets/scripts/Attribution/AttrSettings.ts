import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AttrSettings')
export class AttrSettings{
    [attrName: string]: {
        /** 属性id  */
        id: string,
        /** 属性名称 */
        attrName: string,
        /** 中文名称 */
        attrNameZh: string,
        /** 技能等级 */
        attrLevel: number,
        /** 属性值 */
        attrValue: number,
        /** 缩略图路径 */
        imgPath:string,
        /** 是否可升级 */
        allowUpgrade: boolean,
        /** 缩略图缓存 */
        imgSource:SpriteFrame,
        /** 技能升级的属性数组 */
        upgradeArray: Array<{
            description:string,
            [key: string]: any;
        }>,
    }
}

export const attrSettings = new AttrSettings();

/**
 * 生命值提升
 */
attrSettings['health'] = {
    id: '001',
    attrName: 'health',
    attrNameZh: '生命',
    attrLevel: 1,
    attrValue: 500,
    imgPath:"EnhanceBoard/Skills/Health/spriteFrame",
    imgSource:null,
    allowUpgrade: true,
    upgradeArray: [
        {
            description: "提升生命值",
            attrValue: 700,
        },
        // {
        //     description: "提升生命值",
        //     attrValue: 800,
        // },
        // {
        //     description: "提升生命值",
        //     attrValue: 1000, 
        // },
    ]
}

/**
 * 速度提升
 */
attrSettings['speed'] = {
    id: '002',
    attrName: 'speed',
    attrNameZh: '速度',
    attrLevel: 1,
    attrValue: 1,
    imgPath:"EnhanceBoard/Skills/Speed/spriteFrame",
    imgSource:null,
    allowUpgrade: true,
    upgradeArray: [
        {
            description: "提升速度",
            attrValue: 3.2,
        },
        {
            description: "提升速度",
            attrValue: 3.4,
        },
        {
            description: "提升速度",
            attrValue: 3.6,
        },
        {
            description: "提升速度",
            attrValue: 3.8,
        },
    ]
}

/**
 * 增加当前血量
 */
attrSettings['chicken'] = {
    id: '003',
    attrName: 'chicken',
    attrNameZh: '烧鸡',
    attrLevel: 1,
    attrValue: 30,
    imgPath:"EnhanceBoard/Skills/Chicken/spriteFrame",
    imgSource: null,
    allowUpgrade: false,
    upgradeArray: [
        {
            description: " 增加30生命值",
            attrValue: 30,
        },
    ]
}



