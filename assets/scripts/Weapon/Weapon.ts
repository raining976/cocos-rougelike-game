import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { WeaponAttr } from './WeaponSettings';
@ccclass('Weapon')
export class Weapon extends Component {
    
    private settings = WeaponAttr; // 武器属性
    private id: string; // 武器id
    private weaponName: string; // 武器名称
    private damage: number; // 攻击伤害

    start() {
        this.init(this.node.name);
    }

    init(weaponName: string) {
        this.id = this.settings[weaponName].id;
        this.damage = this.settings[weaponName].damage;
    }
    public getId() {
        return this.id;
    }

    public getName() {
        return this.weaponName;
    }

    public getDamage() {
        return this.damage;
    }

    public setDamage(newDamage: number) {
        this.damage = newDamage;
    }

    public setName(newName: string) {
        this.weaponName = newName;
    }
}

