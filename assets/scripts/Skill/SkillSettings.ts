import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;       

@ccclass('SkillSettings')
export class SkillSettings{
    [index: string]:{
        id: number,
        damage: number,
        skillLevel: number,
        skillLogic: string,
    }
};

export const skillAttr = new SkillSettings();

skillAttr['Dart']={
    id: 1,
    damage: 20,
    skillLevel: 1,
    skillLogic: 'chasing',
    
}




