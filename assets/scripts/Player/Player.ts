import { _decorator, Component, Node, Sprite, ProgressBar } from 'cc';
import { PlayerAttr } from './PlayerSettings';
const { ccclass, property } = _decorator;


@ccclass('Player')
export class Player extends Component {
    @property(Sprite) private sprite: Sprite | null = null;//角色绘图
    @property(Animation) private moveAnim: Animation | null = null;//角色动画
    @property(ProgressBar) private bloodProgressBar: ProgressBar | null = null;//角色血量

    private settings = PlayerAttr;//角色属性组配置
    private id: string = "1" // 角色id

    private healthLimit = 100;//血条上限
    private healthCur: number | null = null;//当前血量

    private damage: number = 10; // 攻击伤害
    private speed: number = 100; // 移动速度
    private attackrange: number = 100; // 攻击范围
    private level: number = 0;//人物等级

    private expLimit: number = 10;//下一次升级所需经验
    private expCur: number = 0;//上次升级后，已获取经验值
    
    start() {
        const playerName: string = "Yellow";
        this.init(playerName);
    }

    update(deltaTime: number) {

    }
    public init(playerName: string): void {
        this.id = this.settings[playerName].id;
        this.healthLimit = this.settings[playerName].healthLimit;
        this.healthCur = this.healthLimit;
        this.damage = this.settings[playerName].damage;
        this.speed = this.settings[playerName].speed;
        this.attackrange = this.settings[playerName].attackrange;
    }
    public getSpeed() {
        return this.speed;
    }

    /**
     * 增加人物经验，如果经验满，则提升等级，提升属性
     * @param deltExp: 所增加的经验值
     */
    public addExp(deltExp: number) {
        this.expCur = deltExp + this.expCur;
        if (this.expCur >= this.expLimit) {
            this.level ++;
            this.expCur = this.expCur - this.expLimit;
            this.expLimit *= 2;
            this.improveAttr();
        } 
        //console.log(this.expCur);
    }

    /**
     * 提升人物属性，在人物升级时调用
     */
    private improveAttr() {
        // TODO:  提升人物属性
    }

    /**
     * 降低生命值
     */
    public subHealth(deltHealth: number = 10) {
        this.healthCur -= deltHealth;
        if (this.healthCur <= 0) {
            console.log("Gameover!");
            // TODO:  调用游戏结束的函数
        }
    }
}


