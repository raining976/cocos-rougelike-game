import { _decorator, Component, Node, NodePool, Prefab } from 'cc';
import { skillSettings } from './SkillSettings';
import { skillControllerSettings } from './SkillControllerSettings';
const { ccclass, property } = _decorator;
/**
 * 所有技能的控制脚本
 * 控制技能的升级 注册 卸载等等
 */
@ccclass('SkillManager')
export class SkillManager extends Component {
    /** 技能预制体数组 要保证预制体名字和setting中的一致 */
    @property(Prefab) skillPrefabs: Prefab[] = [];
    playerBaseNode: Node
    /** 技能预制体节点池相关映射 */
    skills: {
        [key: string]: {
            /** 该技能的预制体  */
            skillPrefab: Prefab,
            /** 该技能节点池 */
            nodePool: NodePool,
            /** 人物基节点 这里都相对于人物的基节点了 */
            playerBaseNode: Node
        }
    } = {}

    start() {
        this.playerBaseNode = this.node.parent // 获取主角基类节点
        /** 测试 */
        let skillName = 'SpinBall'
        this.initSkill(skillName)
    }

    /**
     * 注册技能
     * @param skillName 技能名字
     * @param skillController 技能控制类
     * @param level 技能等级 默认为 1
     */
    registerSkill(skillName: string) {
        const skillPrefab = this.skillPrefabs.find(prefab => prefab.name === skillName)
        if (skillPrefab) {
            this.skills[skillName] = { skillPrefab, nodePool: new NodePool(), playerBaseNode: this.playerBaseNode }
        } else {
            throw new Error(`${skillName} prefab not found!`);
        }
    }


    /**
     * 初始化技能 自动执行注册
     * 包括初始化该技能的预制体节点池等信息
     * @param skillName 技能名字
     */
    initSkill(skillName: string) {
        this.registerSkill(skillName)
        const skillData = this.skills[skillName]
        if (skillData) {
            const { skillPrefab, nodePool, playerBaseNode } = skillData
            console.log(`opening ${skillName} `)
            skillControllerSettings[skillName].controller.initSkill({ skillPrefab, nodePool, playerBaseNode })
        } else {
            throw new Error(`SkillController ${skillName} not found!`);
        }
    }

    /**
     * 技能升级后需要重新执行 以更新技能属性
     * @param skillName 技能名字
     */
    restartSkill(skillName: string) {
        const skillData = this.skills[skillName]
        if (skillData) {
            skillControllerSettings[skillName].controller.startSkill()
        } else {
            throw new Error(`SkillController ${skillName} not found!`);
        }
    }

    /**
     * 卸载技能 如果需要的话
     * @param skillName 技能名称
     */
    unloadSkill(skillName: string) { }

    /**
     * 升级技能
     * @param skillName 技能名字
     */
    upgradeSkill(skillName: string) {
        const nextLevel = skillSettings[skillName].skillLevel + 1
        const upgradeObj = skillSettings[skillName].upgradeArray[nextLevel - 2]

        Object.keys(upgradeObj).forEach(key => {
            skillSettings[skillName][key] = upgradeObj[key];
        })

        skillSettings[skillName].skillLevel++
        this.restartSkill(skillName)
    }



}

