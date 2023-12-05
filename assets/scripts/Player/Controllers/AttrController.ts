import { _decorator, Component, Node ,Prefab,instantiate,UITransform,AudioSource} from 'cc';
import { Player } from '../Player';
import { BloodLabelController } from '../StateLabelControllers/BloodLabelController';
import { ExpLabelController } from '../StateLabelControllers/ExpLabelController';
const { ccclass, property } = _decorator;

@ccclass('AttrController')
export class AttrController extends Component {
    @property(Node) stateLabelNode = null // 人物状态根节点
    @property(Prefab) upgradePrefab = null

    bloodStateEntity: BloodLabelController = null // 血条实体类
    expStateEntity: ExpLabelController = null // 经验实体类
    playerEntity: Player = null // 人物实体类
    upgradeAudio = null // 升级音效
   

    start() {
        this.upgradeAudio = this.node.getComponent(AudioSource)
        this.bloodStateEntity = this.stateLabelNode.getComponentInChildren(BloodLabelController)
        this.expStateEntity = this.stateLabelNode.getComponentInChildren(ExpLabelController)
        this.playerEntity = this.node.getComponent(Player)
        this.initStateLabel()
        this.updateExpLabel()
    }

    updateExpLabel() {
        this.expStateEntity.setAll(this.playerEntity.getCurExp(), this.playerEntity.getMaxExp(), this.playerEntity.getLevel())
    }

    updateBloodLabel() {
        this.bloodStateEntity.setAll(this.playerEntity.getCurHealth(), this.playerEntity.getMaxHealth())
    }

    /**
     * 获取状态节点的实体类
     */
    initStateLabel() {
        this.expStateEntity.setAll(this.playerEntity.getCurExp(), this.playerEntity.getMaxExp(), this.playerEntity.getLevel())
        this.bloodStateEntity.setAll(this.playerEntity.getCurHealth(), this.playerEntity.getMaxHealth())
    }

    /**
     * 在与小怪碰撞后，降低角色血量
     * @param delta 血量降低值
     */
    reduceHealth(delta: number) {
        let newHealth = this.playerEntity.getCurHealth() - delta;
        if (newHealth < 0) {
            alert("game over!!!")
            // TODO: 游戏结束的逻辑
        }
        this.playerEntity.setCurHealth(newHealth);
        this.bloodStateEntity.setCurBlood(newHealth);
    }



    /**
     * 与经验球碰撞后，增加经验值
     * @param delta 经验增加值
     */
    increaseExp(delta: number) {
        let newExp = this.playerEntity.getCurExp() + delta;
        if (newExp > this.playerEntity.getMaxExp()) {
            this.improveLevel(newExp - this.playerEntity.getMaxExp());
        } else {
            this.playerEntity.setCurExp(newExp);
            this.expStateEntity.setCurExp(newExp);
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
        this.playerEntity.setMaxExp(playerEntity.getMaxExp() * 2)
        this.playerEntity.setCurExp(overflowExp)
        this.updateExpLabel()
        this.playUpgrade()
        
        //属性提升
        //TODO:
    }

    /**
     * 播放升级特效
     */
    playUpgrade(){
        this.spawnUpgrade()
        this.upgradeAudio.play()
    }

    /**
     * 生成升级特效
     */
    spawnUpgrade(){
        let upgradePrefab = this.upgradePrefab
        let upgradeNode = instantiate(upgradePrefab)
        this.node.addChild(upgradeNode)
    }


}

