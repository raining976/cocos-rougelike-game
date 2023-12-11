import { _decorator, Component, Node, Sprite, ProgressBar, Label, Script } from 'cc';
import { PlayerAttr } from './PlayerSettings';
import { ExpLabelController } from './StateLabelControllers/ExpLabelController';
import { BloodLabelController } from './StateLabelControllers/BloodLabelController';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Node) expStateNode: Node;
    @property(Node) bloodStateNode: Node;
    expStateController: ExpLabelController;
    bloodStateController: BloodLabelController;

    private settings = PlayerAttr;//角色属性组配置
    private id: string = "1" // 角色id
    private level: number;
    private curHealth: number;//当前血量
    private maxHealth: number;//血量上限
    private curExp: number;//当前经验值
    private maxExp: number;//经验值上限
    private damage: number; // 攻击伤害
    private speed: number; // 移动速度
    private weaponCount: number // 武器数量
    private weaponName: string // 武器名称

    start() {
        const playerName: string = "Yellow";
        this.initStateControllers()
        this.init(playerName);
        this.updateStateLabel()
    }

    initStateControllers() {
        this.expStateController = this.expStateNode.getComponent(ExpLabelController)
        this.bloodStateController = this.bloodStateNode.getComponent(BloodLabelController)
    }

    public init(playerName: string): void {
        this.id = this.settings[playerName].id
        this.level = 1
        this.maxHealth = this.settings[playerName].healthLimit
        this.curHealth = this.maxHealth
        this.maxExp = 100
        this.curExp = 0
        this.damage =  this.settings[playerName].damage
        this.speed = this.settings[playerName].speed
        this.weaponCount =  this.settings[playerName].weaponCount
        this.weaponName = this.settings[playerName].weaponName
    }

    updateStateLabel(){
        this.expStateController.setAll(this.curExp,this.maxExp,this.level)
        this.bloodStateController.setAll(this.curHealth,this.maxHealth)
        'updateStateLabel'
    }


    public getId(): string {
        return this.id;
    }

    public setId(value: string) {
        this.id = value;
    }

    public setSpeed(value: number) {
        this.speed = value;
    }

    public getSpeed() {
        return this.speed;
    }

    public setCurHealth(newHealth: number) {
        this.bloodStateController.setCurBlood(newHealth)
        this.curHealth = newHealth;
    }
    public getCurHealth() {
        return this.curHealth;
    }

    public getMaxHealth() {
        return this.maxHealth;
    }

    public getPerSentHealth() {
        return this.curHealth / this.maxHealth;
    }

    public setCurExp(newExp: number) {
        this.expStateController.setCurExp(newExp);
        this.curExp = newExp;
    }
    public getCurExp() {
        return this.curExp;
    }
    public getMaxExp() {
        return this.maxExp;
    }

    public setMaxExp(newExp: number) {
        this.expStateController.setMaxExp(newExp);
        this.maxExp = newExp;
    }
    public getLevel() {
        return this.level
    }

    public getDamage() {
        return this.damage
    }



    public setLevel(newLevel: number) {
        this.expStateController.setLevel(newLevel)
        this.level = newLevel;
    }

    public setDamage(newDamage: number) {
        this.damage = newDamage
    }

    public getWeaponName() {
        return this.weaponName;
    }

    public setWeaponName(newWeaponName: string) {
        this.weaponName = newWeaponName;
    }

    public getWeaponCount() {
        return this.weaponCount;
    }

    public setWeaponCount(newWeaponCount: number) {
        this.weaponCount = newWeaponCount;
    }

    public setMaxHealth(newMaxHealth: number) {
        this.maxHealth = newMaxHealth;
    }



}


