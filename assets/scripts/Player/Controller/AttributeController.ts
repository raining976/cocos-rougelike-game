import { _decorator, Component, Node } from 'cc';
import { Player } from '../Player';
import { ENHANCE_TYPE } from '../../EnhanceBoard/EnhanceSettings';
import { Enhance } from '../../EnhanceBoard/Enhance';
const { ccclass, property } = _decorator;

@ccclass('AttributeController')
export class AttributeController extends Component {
    private passiveSkills: Enhance[] = new Array(ENHANCE_TYPE.LENGTH);
    private player;


    initPassiveSkills() {
        let index: number;
        for (index = 0; index < this.passiveSkills.length; index ++) {
            this.passiveSkills[index] = new Enhance();
            this.passiveSkills[index].init(index);
        }
    }
    /**
     * 提升角色生命值
     */
    improveMaxHealth() {
        this.passiveSkills[ENHANCE_TYPE.ENHANCE_HEALTH].addCurLevel();
        this.player.setMaxHealth(this.computeMaxHealth(this.passiveSkills[ENHANCE_TYPE.ENHANCE_HEALTH].getCurLevel()));
        //TODO:调整属性平衡
    }

    /**
     * 提升角色攻击力
     */
    improveDamage() {
        this.passiveSkills[ENHANCE_TYPE.ENHANCE_DAMAGE].addCurLevel();
        this.player.setDamage(this.computeDamage(this.passiveSkills[ENHANCE_TYPE.ENHANCE_DAMAGE].getCurLevel()));
        //TODO:调整属性平衡
    }

    improveSpeed() {
        this.passiveSkills[ENHANCE_TYPE.ENHANCE_SPEED].addCurLevel();
        this.player.setSpeed(this.computeSpeed(this.passiveSkills[ENHANCE_TYPE.ENHANCE_SPEED].getCurLevel()));
        //TODO:调整属性平衡
    }

    /**
     * 速度计算算法
     * @param nextSpeedLevel 
     * @returns 
     */
    public computeSpeed(level: number) {
        return level * 1.2 + 3;
    }

    /**
     * 攻击力计算算法
     * @param nextDamageLevel 
     * @returns 
     */
    public computeDamage(level: number) {
        return level * 2;
    }

    /**
     * 最大生命值计算算法
     * @param nextMaxHealthLevel 
     * @returns 
     */
    public computeMaxHealth(level: number) {
        return level * 200;
    }

    /**
     * 获取某一属性的增强等级
     * @param index 
     * @returns 
     */
    getPassiveSkillCurLevel(index: ENHANCE_TYPE) {
        //console.log(this.passiveSkills[index].getCurLevel())
        return 1//this.passiveSkills[index].getCurLevel();
    }
    start() {
        this.player = this.node.getComponent(Player);
        this.initPassiveSkills();
    }

    update(deltaTime: number) {
        
    }
}


