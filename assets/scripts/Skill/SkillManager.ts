import { _decorator, Component, director, Node, NodePool, Prefab } from 'cc';
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
    /** 人物基节点 */
    playerBaseNode: Node
    /** 技能节点的容器 */
    skillNodeContainer: Node;

    /** 技能预制体节点池相关映射 */
    skills: {
        [key: string]: {
            /** 该技能的预制体  */
            skillPrefab: Prefab,
            /** 该技能节点池 */
            nodePool: NodePool,
            /** 人物基节点 这里都相对于人物的基节点了 */
            playerBaseNode: Node,
            /** 飞行物容器节点 */
            skillNodeContainer: Node,
        }
    } = {}

    start() {
        this.playerBaseNode = this.node.parent // 获取主角基类节点
        this.skillNodeContainer = director.getScene().getChildByName('Canvas').getChildByName('NodePool')

        this.initSkill("SpinBall")
        this.initSkill("Bomb")
        this.initSkill("Dart")
        this.initSkill("StraightBall")
        this.upgradeSkill("SpinBall")
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
            this.skills[skillName] = { skillPrefab, nodePool: new NodePool(), playerBaseNode: this.playerBaseNode, skillNodeContainer: this.skillNodeContainer }
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
            const { skillPrefab, nodePool, playerBaseNode, skillNodeContainer } = skillData
            skillControllerSettings[skillName].controller.initSkill({ skillPrefab, nodePool, playerBaseNode, skillNodeContainer })
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
    unloadSkill(skillName: string) {
        skillControllerSettings[skillName].controller.unloadSkill()
    }

    /**
     * 升级技能
     * @param skillName 技能名字
     */
    upgradeSkill(skillName: string, isReset = false) {
        if(!this.skills[skillName] && !isReset) {
            this.initSkill(skillName)
            return 
        }

        let nextLevel = skillSettings[skillName].skillLevel + 1;

        if(isReset) nextLevel = 1;

        const upgradeObj = skillSettings[skillName].upgradeArray[nextLevel - 1]

        Object.keys(upgradeObj).forEach(key => {
            if (key != 'description')
                skillSettings[skillName][key] = upgradeObj[key];
        })


        if (!isReset) {
            skillSettings[skillName].skillLevel++
            this.restartSkill(skillName)
        }
    }

    resetSkillSetting(skillName) {
        this.upgradeSkill(skillName, true)
    }


    resetAllSkills() {
        Object.keys(this.skills).forEach(skillName => {
            this.unloadSkill(skillName)
            this.resetSkillSetting(skillName)
            this.skills[skillName] = null
        })

        this.initSkill('SpinBall')
    }


    
}
