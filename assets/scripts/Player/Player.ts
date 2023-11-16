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
    private level: number = 0;
    private curHealth: number = 100;//当前血量
    private maxHealth: number = 100;//血量上限
    private curExp: number = 100;//当前经验值
    private maxExp: number = 100;//经验值上限
    private damage: number = 10; // 攻击伤害
    private speed: number = 100; // 移动速度
    private attackrange: number = 100; // 攻击范围
    
    start() {
        const playerName: string = "Yellow";
        this.init(playerName);
    }

    update(deltaTime: number) {
        //更新血量
    }

    public init(playerName: string): void {
        this.id = this.settings[playerName].id;
        this.level = 0;
        this.maxHealth = this.settings[playerName].health;
        this.curHealth = this.maxHealth;
        this.maxExp = 100;
        this.curExp = this.maxExp;
        this.damage = this.settings[playerName].damage;
        this.speed = this.settings[playerName].speed;
        this.attackrange = this.settings[playerName].attackrange;
    }


    /**
     * 经验值满后，提升等级
     * @param overflowExp 溢出经验值
     */
    public improveLevel(overflowExp: number) {
        //经验、等级
        this.level ++;
        this.maxExp *= 2;
        this.curExp = overflowExp;
        //属性提升
        //TODO:
    }

    public getSpeed() {
        return this.speed;
    }

    public setCurHealth(newHealth: number) {
        this.curHealth = newHealth;
    }
    public getCurHealth() {
        return this.curHealth;
    }

    public setCurExp(newExp: number) {
        this.curExp = newExp;
    }
    public getCurExp() {
        return this.curExp;
    }
    public getMaxExp() {
        return this.maxExp;
    }
}


