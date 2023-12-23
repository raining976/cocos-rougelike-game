import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

export enum ENHANCE_TYPE {
    ENHANCE_DAMAGE,
    ENHANCE_HEALTH,
    ENHANCE_SPEED,
    //LENGTH,
    ENHANCE_SPINBALL = 'SpinBall',
    ENHANCE_STRTBALL = 'StraigtBall',
    ENHANCE_BOMB = 'Bomb',
    
}

@ccclass('EnhanceSettings')
export class EnhanceSettings{
    [index: number]: {
        name: string,
        description: string,
        maxLevel: number,
        imagePath: string,
        sprite: SpriteFrame
    }
};

export const enhanceSettings = new EnhanceSettings();
enhanceSettings[ENHANCE_TYPE.ENHANCE_DAMAGE] = {
    name: 'Power',
    description: '提高角色攻击力',
    maxLevel: 10,
    imagePath: "EnhanceBoard/Skills/Power/spriteFrame",
    sprite: null
}

enhanceSettings[ENHANCE_TYPE.ENHANCE_HEALTH] = {
    name: 'Health',
    description: '提高角色生命力',
    maxLevel: 10,
    imagePath: "EnhanceBoard/Skills/Health/spriteFrame",
    sprite: null,
}

enhanceSettings[ENHANCE_TYPE.ENHANCE_SPEED] = {
    name: 'Speed',
    description: '提高角色移动速度',
    maxLevel: 10,
    imagePath: "EnhanceBoard/Skills/Speed/spriteFrame",
    sprite: null,
}

enhanceSettings[ENHANCE_TYPE.ENHANCE_SPINBALL] = {
    name: 'SpinBall',
    description: '坤球旋转',
    maxLevel: 10,
    imagePath: "EnhanceBoard/Skills/SpinBall/spriteFrame",
    sprite: null,
}

enhanceSettings[ENHANCE_TYPE.ENHANCE_STRTBALL] = {
    name: 'StraightBall',
    description: '直球, 就是直着发射的球',
    maxLevel: 10,
    imagePath: "EnhanceBoard/Skills/StraightBall/spriteFrame",
    sprite: null,
}