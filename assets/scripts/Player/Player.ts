import { _decorator, Component, Node, Sprite, ProgressBar,Label } from 'cc';
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
    private attackRange: number = 100; // 攻击范围

    @property({type: Label}) 
    public expLabel: Label|null = null;//当前经验标签
    @property({type: Label}) 
    public stateLabel: Label|null = null;//当前等级标签
    @property({type: Label}) 
    public ceilLabel: Label|null = null;//当前经验上限标签

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
        this.maxHealth = this.settings[playerName].healthLimit;
        this.curHealth = this.maxHealth;
        this.maxExp = 100;
        this.curExp = this.maxExp;
        this.damage = this.settings[playerName].damage;
        this.speed = this.settings[playerName].speed;
        this.attackRange = this.settings[playerName].attackRange;

        this.expLabel.string=this.curExp.toString();
        this.stateLabel.string=this.level.toString();
        this.ceilLabel.string=this.maxExp.toString();
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
        this.expLabel.string=this.curExp.toString();
    }
    public getCurExp() {
        return this.curExp;
    }
    public getMaxExp() {
        return this.maxExp;
    }

    public setMaxExp(newExp :number){
        this.maxExp = newExp;
        this.ceilLabel.string=this.maxExp.toString();
    }
    public getLevel() {
        return this.level
    }

    public getDamage() {
        return this.damage
    }

    public getAttackRange() {
        return this.attackRange
    }

    public getId(){
        return this.id
    }

    public setLevel(newLevel:number){
        this.level = newLevel;
        this.stateLabel.string=this.level.toString();
    }

    public setDamage(newDamage:number){
        this.damage = newDamage
    }



}


