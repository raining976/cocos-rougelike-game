import { _decorator, Collider2D, Component, Contact2DType, director, Director, IPhysics2DContact, Node } from 'cc';
import { skillAttr } from './SkillSettings';
const { ccclass, property } = _decorator;

/**
 * 技能类的父类
 */
@ccclass('Skill')
export class Skill extends Component {

    protected settings = skillAttr  //导入技能属性组, 属性组决定技能行为
    protected id:number;            //技能id
    protected damage:number;        //技能伤害
    protected skillLevel:number;    //技能等级
    protected skillLogic:string;    //技能逻辑

}


