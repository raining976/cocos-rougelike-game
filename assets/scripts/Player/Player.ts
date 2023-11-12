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
    private health: number = 100;//血条上限
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
        this.health = this.settings[playerName].health;
        this.damage = this.settings[playerName].damage;
        this.speed = this.settings[playerName].speed;
        this.attackrange = this.settings[playerName].attackrange;
    }
    public getSpeed() {
        return this.speed;
    }
}


