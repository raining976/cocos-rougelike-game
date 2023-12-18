import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;       

@ccclass('SkillSettings')
class SkillSettings{
    [index: string]:{
        id: number,
        damage: number,
        skillLevel: number,
    }
};

const skillSettings = new SkillSettings();
skillSettings['Dart']={
    id: 1,
    damage: 20,
    skillLevel: 1,
}

export default skillSettings




