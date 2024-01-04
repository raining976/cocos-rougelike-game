import { _decorator, animation, Component, Node, randomRange, Vec3, Animation, math, director, UITransform } from 'cc';
import { skillSettings } from '../SkillSettings';
import { SkillController } from '../SkillController';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('BombController')
export class BombController extends SkillController {
    private static skillName = 'Bomb';
    private static settings = skillSettings['Bomb'];
    private static windowWidth
    private static windowHeight
    /**
     * 启动技能重写
     */
    static startSkill() {
        let uiTranform = director.getScene().getChildByName('Canvas').getComponent(UITransform);
        this.windowWidth = uiTranform.width;
        this.windowHeight = uiTranform.height;
        this.startReleaseSkill(this.settings.releaseInterval);
    }

    /**
     * 生成一个随机相对位置
     * @returns 随机相对角色位置
     */
    private static generateRandomPosition(maxW: number, maxH: number) {
        const randomNum = (max: number) => {
            const range = Math.min(this.settings.range, max)
            return range * randomRange(-1, 1)
        }
        return new Vec3(randomNum(maxW / 2), randomNum(maxH / 2), 0).add(this.playerBaseNode.position)
    }


    /**
     * 释放技能重写
     */
    static releaseSkill() {
        /**
         * 生成
         * 设置随机坐标
         */

        for (let i = 0; i < this.settings.skillCount; i++) {
            let skillNode = this.spawnSingleSkill()
            this.curNodes.push(skillNode)
            skillNode.setWorldPosition(this.generateRandomPosition(this.windowWidth, this.windowHeight))
            skillNode.getComponent(Skill).initSkill(this.skillName) // 更新
            this.skillNodeContainer.addChild(skillNode)
            skillNode.children[0].active = false
            let duration = skillNode.children[1].getComponent(Animation).getState(this.skillName).duration
            skillNode.getChildByName("BlackHole").getComponent(Animation).play(this.skillName)
            setTimeout(() => {
                skillNode.children[0].active = true
            }, duration * 1000)

            this.autoReclaimSkill(skillNode, this.settings.duration);
        }
    }


}


