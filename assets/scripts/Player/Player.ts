import { _decorator, Component, Node, Sprite, ProgressBar, Label, Script } from 'cc';
import { PlayerAttr } from './PlayerSettings';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    private settings = PlayerAttr;//角色属性组配置
    private id: string = "1" // 角色id
    private level: number = 1;
    private curHealth: number = 100;//当前血量
    private maxHealth: number = 100;//血量上限
    private curExp: number = 0;//当前经验值
    private maxExp: number = 100;//经验值上限
    private damage: number = 10; // 攻击伤害
    private speed: number = 100; // 移动速度
    private attackRange: number = 100; // 攻击范围
    private weaponCount: number = 1 // 武器数量
    private weaponName: string = 'default' // 武器名称

    start() {
        const playerName: string = "Yellow";
        this.init(playerName);
    }

    update(deltaTime: number) {
        //更新血量
    }

    public init(playerName: string): void {
        this.id = this.settings[playerName].id;
        this.level = 1;
        this.maxHealth = this.settings[playerName].healthLimit;
        this.curHealth = this.maxHealth;
        this.maxExp = 30//TODO:100;
        this.curExp = 0;
        this.damage = this.settings[playerName].damage;
        this.speed = this.settings[playerName].speed;
        this.attackRange = this.settings[playerName].attackRange;
        this.weaponCount = this.settings[playerName].weaponCount;
        this.weaponName = this.settings[playerName].weaponName;
    }




    public getSpeed() {
        return this.speed;
    }

    public setSpeed(newSpeed: number) {
        this.speed = newSpeed;
    }
    public setCurHealth(newHealth: number) {
        this.curHealth = newHealth;
    }
    public getCurHealth() {
        return this.curHealth;
    }
    public getMaxHealth() {
        return this.maxHealth;
    }

    public getPerSentHealth() {
        return this.curHealth/this.maxHealth;
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

    public setMaxExp(newExp: number) {
        this.maxExp = newExp;
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

    public getId() {
        return this.id
    }

    public setLevel(newLevel: number) {
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


