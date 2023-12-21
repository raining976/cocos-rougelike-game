import { _decorator, animation, Component, Node, randomRange, Vec3, Animation, math, director, UITransform } from 'cc';
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
    private static generateRandomPosition(maxX: number, maxY: number) {
        const range = this.settings.range
        const randomNum = (n: number)=>{
            let result = range * randomRange(-1, 1)
            if (result < -n)
                result = -n
            else if (result > n)
                result = n
            return result
        }
        return new Vec3(randomNum(maxX), randomNum(maxY),0).add(this.playerBaseNode.position)
    }


    /**
     * 释放技能重写
     */
    static releaseSkill() {
        let uiTranform = director.getScene().getChildByName('Canvas').getComponent(UITransform);
        let widthCanvas = uiTranform.width;
        let heightCanvas = uiTranform.height;
        for(let i = 0; i < this.settings.skillCount ; i++)  {
            let skillNode = this.spawnSingleSkill()
            skillNode.setWorldPosition(this.generateRandomPosition(widthCanvas/2, heightCanvas/2))
            skillNode.getComponent(Skill).initSkill(this.skillName) // 更新
            this.skillNodeContainer.addChild(skillNode)
            skillNode.getComponent(Animation).play(this.skillName)
            this.autoReclaimSkill(skillNode,this.settings.duration);
        }
    }

    
}


