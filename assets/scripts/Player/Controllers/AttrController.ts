import { _decorator, Component, Node, Prefab, instantiate, UITransform, AudioSource, director } from 'cc';
import { Player } from '../Player';
import { BloodLabelController } from '../StateLabelControllers/BloodLabelController';
import { ExpLabelController } from '../StateLabelControllers/ExpLabelController';
import { FloatLabelBase } from '../../FloatLabel/FloatLabelBase';
import { ENHANCE_TYPE } from '../../EnhanceBoard/EnhanceSettings';
import { EnhanceController } from '../../EnhanceBoard/EnhanceController';
import { MoveController, PLAYER_STATE } from './MoveController';
const { ccclass, property } = _decorator;

@ccclass('AttrController')
export class AttrController extends Component {
    @property(Node) stateLabelNode = null // 人物状态根节点
    @property(Prefab) upgradePrefab = null
    @property(Prefab) floatLabelPrefab: Prefab;

    @property(Node) enhanceBoard: Node | null = null;

    playerEntity: Player = null // 人物实体类
    upgradeAudio = null // 升级音效
    passiveSkillsCurLevel: number[] = new Array(ENHANCE_TYPE.LENGTH);//角色被动技能当前等级

    start() {
        this.upgradeAudio = this.node.getComponent(AudioSource)
        this.playerEntity = this.node.getComponent(Player)
        this.initPassiveSkills();
    }



    /**
     * 在与小怪碰撞后，降低角色血量
     * @param delta 血量降低值
     */
    reduceHealth(delta: number) {
        let newHealth = this.playerEntity.getCurHealth() - delta;
        if (newHealth <= 0) {
            this.node.getComponent(MoveController).changeState(PLAYER_STATE.DEAD)
            // TODO: 游戏结束的逻辑
            // setTimeout(() => {
            //     alert("game over!!!")
            // }, 2000);
        } else {
            let label = instantiate(this.floatLabelPrefab)
            label.getComponent(FloatLabelBase).initLabel('Player', delta)
            this.node.parent.addChild(label)
        }
        this.playerEntity.setCurHealth(newHealth);
    }



    /**
     * 与经验球碰撞后，增加经验值
     * @param delta 经验增加值
     */
    increaseExp(delta: number) {
        let newExp = this.playerEntity.getCurExp() + delta;
        if (newExp >= this.playerEntity.getMaxExp()) {
            this.improveLevel(newExp - this.playerEntity.getMaxExp());
        } else {
            this.playerEntity.setCurExp(newExp);
            // this.expStateEntity.setCurExp(newExp);
        }

    }

    /**
    * 经验值满后，提升等级
    * @param overflowExp 溢出经验值
    */
    improveLevel(overflowExp: number) {
        //经验、等级
        const playerEntity = this.playerEntity
        this.playerEntity.setLevel(playerEntity.getLevel() + 1)
        //TODO:this.playerEntity.setMaxExp(playerEntity.getMaxExp() * 2)
        this.playerEntity.setCurExp(overflowExp)
        this.playUpgrade()
        //激活面板
        this.enhanceBoard.getComponent(EnhanceController).boardAppear()
        //暂停场景,如果不进行延迟执行，显示图片会乱，甚至显示不出来
        setTimeout(() => {
            director.stopAnimation();
        }, 500)
        //属性提升
        //TODO:
    }

    /**
     * 播放升级特效
     */
    playUpgrade() {
        this.spawnUpgrade()
        this.upgradeAudio.play()
    }

    /**
     * 生成升级特效
     */
    spawnUpgrade() {
        let upgradePrefab = this.upgradePrefab
        let upgradeNode = instantiate(upgradePrefab)
        this.node.addChild(upgradeNode)
    }

    /**
     * 初始化技能等级
     */
    initPassiveSkills() {
        let index: number;
        for (index = 0; index < this.passiveSkillsCurLevel.length; index++)
            this.passiveSkillsCurLevel[index] = 0;
    }
    /**
     * 提升角色生命值
     */
    improveMaxHealth() {
        this.passiveSkillsCurLevel[ENHANCE_TYPE.ENHANCE_HEALTH]++;
        let newMaxHealth = this.computeMaxHealth(this.passiveSkillsCurLevel[ENHANCE_TYPE.ENHANCE_HEALTH]);
        this.playerEntity.setMaxHealth(newMaxHealth);
        //TODO:调整属性平衡
    }

    /**
     * 提升角色攻击力
     */
    improveDamage() {
        this.passiveSkillsCurLevel[ENHANCE_TYPE.ENHANCE_DAMAGE]++;
        let newDamage = this.computeDamage(this.passiveSkillsCurLevel[ENHANCE_TYPE.ENHANCE_DAMAGE]);
        this.playerEntity.setDamage(newDamage);
        //TODO:调整属性平衡
    }

    improveSpeed() {
        this.passiveSkillsCurLevel[ENHANCE_TYPE.ENHANCE_SPEED]++;
        let newSpeed = this.computeSpeed(this.passiveSkillsCurLevel[ENHANCE_TYPE.ENHANCE_SPEED]);
        this.playerEntity.setSpeed(newSpeed);
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
        return this.passiveSkillsCurLevel[index];
    }

}

