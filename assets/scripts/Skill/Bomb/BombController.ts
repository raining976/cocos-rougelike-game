import { _decorator, animation, Component, Node, randomRange, Vec3, Animation, math } from 'cc';
import { skillSettings } from '../SkillSettings';
import { SkillController } from '../SkillController';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('BombController')
export class BombController extends SkillController {
    private static skillName = 'Bomb';
    private static settings = skillSettings['Bomb'];
    /**
     * 启动技能重写
     */
    static startSkill() {
        this.startReleaseSkill(this.settings.releaseInterval);
    }


    /**
     * 生成一个随机相对位置
     * @returns 随机相对角色位置
     */
    private static generateRandomPosition(/*maxWidth: number, maxHeight: number*/) {
        const range = this.settings.range
        const randomNum = ()=>{
            return range*randomRange(-1,1)
        }
        return new Vec3(randomNum(), randomNum(),0).add(this.playerBaseNode.position)
    }


    /**
     * 释放技能重写
     */
    static releaseSkill() {
        
        for(let i = 0; i < this.settings.skillCount ; i++)  {
            let skillNode = this.spawnSingleSkill()
            skillNode.setWorldPosition(this.generateRandomPosition())
            skillNode.getComponent(Skill).initSkill(this.skillName) // 更新
            this.playerBaseNode.parent.addChild(skillNode)
            skillNode.getComponent(Animation).play(this.skillName)
            this.autoReclaimSkill(skillNode,this.settings.duration);
        }
    }

    
}


