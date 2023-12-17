import { _decorator, Component, Node, NodePool, Prefab } from 'cc';
import { Skill } from './Skill';
import { skillSettings } from './SkillSettings';
import { SkillController } from './SkillController';
import { SpinBallController } from './SpinBall/SpinBallController';
const { ccclass, property } = _decorator;

@ccclass('SkillManager')
export class SkillManager extends Component {
    @property(Prefab) skillPrefabs: Prefab[] = [];
    playerBaseNode: Node
    /**
     * 技能控制器的映射
     */
    skillControllers: {
        [key: string]: {
            constructor: typeof SkillController,
            level: number,
            skillPrefab: Prefab,
            nodePool: NodePool,
            playerBaseNode: Node
        }
    } = {}


    // skillName : SkillController
    skillControllerMap = {
        'SpinBall': SpinBallController
    }

    start() {
        this.playerBaseNode = this.node.parent
        this.registerSkill('SpinBall', this.skillControllerMap['SpinBall'])
        this.initSkill("SpinBall")

    }

    /**
     * 
     * @param skillName 技能名字
     * @param skillController 技能控制类
     * @param level 技能等级 默认为 1
     */
    registerSkill(skillName: string, skillController: typeof SkillController, level: number = 1) {
        const skillPrefab = this.skillPrefabs.find(prefab => prefab.name === skillName)
        if (skillPrefab) {
            this.skillControllers[skillName] = { constructor: skillController, level, skillPrefab, nodePool: new NodePool(), playerBaseNode: this.playerBaseNode }
        } else {
            throw new Error(`${skillName} prefab not found!`);
        }
    }


    initSkill(skillName: string) {
        const skillData = this.skillControllers[skillName]
        if (skillData) {
            const { constructor: SkillControllerClass, level, skillPrefab, nodePool,playerBaseNode } = skillData
            console.log(`opening ${skillName} at level ${level}`)
            SkillControllerClass.initSkill({ skillPrefab, level, nodePool ,playerBaseNode})
        } else {
            throw new Error(`SkillController ${skillName} not found!`);
        }
    }

    restartSkill(skillName:string){
        const skillData = this.skillControllers[skillName]
        if (skillData) {
            const { constructor: SkillControllerClass} = skillData
            SkillControllerClass.startSkill()
        } else {
            throw new Error(`SkillController ${skillName} not found!`);
        }
    }

    closeSkill(className: string) {

    }

    /**
     * 升级技能
     * @param skillName 技能名字
     */
    upgradeSkill(skillName: string) {
        const nextLevel = this.skillControllers[skillName].level + 1
        const upgradeObj = skillSettings[skillName].upgradeArray[nextLevel - 2];

        Object.keys(upgradeObj).forEach(key => {
            skillSettings[skillName][key] = upgradeObj[key];
        })

        this.skillControllers[skillName].level++
        this.restartSkill(skillName)
    }

    

}

