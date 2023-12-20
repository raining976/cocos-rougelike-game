import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum ENHANCE_TYPE {
    ENHANCE_DAMAGE,
    ENHANCE_HEALTH,
    ENHANCE_SPEED,
    LENGTH
}

@ccclass('EnhanceSettings')
export class EnhanceSettings{
    [index: number]: {
        type: ENHANCE_TYPE,
        name: string,
        description: string,
        maxLevel: number,
        imagePath: string,
    }
};

export const enhanceSettings = new EnhanceSettings();
enhanceSettings[ENHANCE_TYPE.ENHANCE_DAMAGE] = {
    type: ENHANCE_TYPE.ENHANCE_DAMAGE,
    name: '神力',
    description: '提高角色攻击力',
    maxLevel: 5,
    imagePath: "EnhanceBoard/Skills/power/spriteFrame"
}

enhanceSettings[ENHANCE_TYPE.ENHANCE_HEALTH] = {
    type: ENHANCE_TYPE.ENHANCE_HEALTH,
    name: '生命',
    description: '提高角色生命力',
    maxLevel: 5,
    imagePath: "EnhanceBoard/Skills/power/spriteFrame",
}

enhanceSettings[ENHANCE_TYPE.ENHANCE_SPEED] = {
    type: ENHANCE_TYPE.ENHANCE_SPEED,
    name: '迅影',
    description: '提高角色移动速度',
    maxLevel: 5,
    imagePath: "EnhanceBoard/Skills/speed/spriteFrame"
}
