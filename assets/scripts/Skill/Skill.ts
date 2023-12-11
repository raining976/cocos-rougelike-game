import { _decorator, Collider2D, Component, Contact2DType, director, Director, IPhysics2DContact, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 技能类的父类
 */
@ccclass('Skill')
export class Skill extends Component {
    protected id: number;            //技能id
    protected damage: number;        //技能伤害
    protected skillLevel: number;    //技能等级

    public getId(): number { return this.id; }
    public setId(id: number) { this.id = id }

    public getDamage(): number { return this.damage; }
    public setDamage(damage: number) { this.damage = damage }
    public getSkillLevel(): number { return this.skillLevel; }
    public setSkillLevel(skillLevel: number) { this.skillLevel = skillLevel }





}


