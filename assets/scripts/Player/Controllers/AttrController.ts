import { _decorator, Component, Node, Prefab, instantiate, UITransform, AudioSource, director } from 'cc';
import { Player } from '../Player';
import { BloodLabelController } from '../StateLabelControllers/BloodLabelController';
import { ExpLabelController } from '../StateLabelControllers/ExpLabelController';
import { FloatLabelBase } from '../../FloatLabel/FloatLabelBase';
import { ENHANCE_TYPE } from '../../EnhanceBoard/EnhanceSettings';
import { EnhanceController } from '../../EnhanceBoard/EnhanceController';
import { MoveController, PLAYER_STATE } from './MoveController';
import { GameController, GameState } from '../../Control/GameController';
const { ccclass, property } = _decorator;

@ccclass('AttrController')
export class AttrController extends Component {
    @property(Node) stateLabelNode = null // 人物状态根节点
    @property(Prefab) upgradePrefab = null
    @property(Prefab) floatLabelPrefab: Prefab;
    @property(Node) enhanceBoard: Node | null = null;

    @property(Node) gameRoot: Node
    playerEntity: Player = null // 人物实体类
    upgradeAudio = null // 升级音效

    start() {
        this.upgradeAudio = this.node.getComponent(AudioSource)
        this.playerEntity = this.node.getComponent(Player)

        // setTimeout(() => {
        //     this.gameRoot.getComponent(GameController).setCurState(GameState.GS_END)
        // }, 2000);
    }


    /**
     * 在与小怪碰撞后，降低角色血量
     * @param delta 血量降低值
     */
    reduceHealth(delta: number) {
        let newHealth = this.playerEntity.getCurHealth() - delta;
        if (newHealth <= 0) {
            this.node.getComponent(MoveController).changeState(PLAYER_STATE.DEAD)
            this.gameRoot.getComponent(GameController).setCurState(GameState.GS_END)
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
     * 与鸡腿碰撞后，增加当前生命值
     * @param delta 生命恢复量
     */
    increaseHealth(delta: number) {
        let newHealth = this.playerEntity.getCurHealth() + delta;
        if (newHealth >= this.playerEntity.getMaxHealth()) {
            this.playerEntity.setCurHealth(this.playerEntity.getMaxHealth());
        } else {
            this.playerEntity.setCurHealth(newHealth);
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
        this.playerEntity.setMaxExp(playerEntity.getMaxExp() * 1.1)
        this.playerEntity.setCurExp(overflowExp)
        this.playUpgrade()
        //激活面板
        this.enhanceBoard.getComponent(EnhanceController).boardAppear()
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

}

