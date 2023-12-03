import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum ENHANCE_TYPE {
    ENHANCE_DAMAGE,
    ENHANCE_HEALTH,
    ENHANCE_SPEED,
    LENGTH
}

@ccclass('PlayerSettings')
export class EnhanceSettings{
    [index: number]: {
        type: ENHANCE_TYPE,
        name: string,
        description: string,
        maxLevel: number,
    }
};

export const EnhanceAttr = new EnhanceSettings();
EnhanceAttr[ENHANCE_TYPE.ENHANCE_DAMAGE] = {
    type: ENHANCE_TYPE.ENHANCE_DAMAGE,
    name: '烈焰风暴',
    description: '提高角色攻击力',
    maxLevel: 5
}

EnhanceAttr[ENHANCE_TYPE.ENHANCE_HEALTH] = {
    type: ENHANCE_TYPE.ENHANCE_HEALTH,
    name: '沐浴回春',
    description: '提高角色生命力',
    maxLevel: 5
}

EnhanceAttr[ENHANCE_TYPE.ENHANCE_SPEED] = {
    type: ENHANCE_TYPE.ENHANCE_SPEED,
    name: '疾风迅影',
    description: '提高角色移动速度',
    maxLevel: 5
}
// class EnhanceType <T extends string>{
//     private descriptions: Record<T,string>;
//     constructor(public value:T) { }

//     description(description:string) :this{
//         this.descriptions[this.value] = description;
//         return this;
//     }
//     getDescription():string{
//         return this.descriptions[this.value];
//     }
// }


// export const ENHANCE_TYPE = {
//     ENHANCE_DAMAGE : new EnhanceType("ENHANCE_DAMAGE").description('提升攻击力'),
//     ENHANCE_HEALTH : new EnhanceType("ENHANCE_HEALTH").description('提高声明值'),
//     ENHANCE_SPEED  : new EnhanceType("ENHANCE_SPEED").description('提高移动速度'),
// }

// ENHANCE_TYPE.ENHANCE_DAMAGE.getDescription()


