import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkillSettings')
class SkillSettings {
    [skillName: string]: {
        id: string, // 技能id
        skillName: string, // 技能名字
        damage: number, // 技能伤害
        skillCount: number, // 技能数量 (有的技能一次释放多个)
        duration: number, // 技能持续时间
        range: number, // 技能范围
        releaseInterval: number, // 技能释放间隔
        upgradeArray: Array<Object>, // 技能升级数组
    }
}

export const skillSettings = new SkillSettings();

/**
 * 旋转篮球
 */
skillSettings['SpinBall'] = {
    id: '001',
    skillName: "SpinBall",
    damage: 100,
    skillCount:2,
    duration: 1000,
    range: 100,
    releaseInterval: 500,
    upgradeArray: [
        {
            damage: 110,
        }, {
            range: 110,
        }
    ]

}


/**
 * 升级函数的样例
 */
// function func(){
//     let skillName = 'SpinBall'
//     let level = 2
//     let upgradeArr = skillSettings[skillName].upgradeArray[level-2]

//     Object.keys(upgradeArr).forEach(key=>{
//         skillSettings[skillName][key] = upgradeArr[key]
//     })
// }

