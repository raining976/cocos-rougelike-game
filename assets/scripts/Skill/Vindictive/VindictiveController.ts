import { _decorator, Component, Node } from 'cc';
import { SkillController } from '../SkillController';
import { skillSettings } from '../SkillSettings';
const { ccclass, property } = _decorator;

@ccclass('VindictiveController')
export class VindictiveController extends SkillController {
    private static skillName = 'Vindictive';
    private static settings = skillSettings['SpinBall']; // 技能设置 不知道这里是不是符号传递 有待测试
    private static curBallNodes: Array<Node> = []; // 当前所有的节点
    /**
     * 开始执行技能
     */

     static startSkill() {
        this.spawnSkill()
    }

    /**
     * 生成技能
     */
    private static spawnSkill() {
        const len = this.curBallNodes.length
        for (let i = 0; i < targetCount - len; i++) {
            let node = this.spawnSingleSkill()
            this.playerBaseNode.addChild(node)
            this.curBallNodes.push(node)
        }
        this.setNodes()
    }

    

    /**
     * 给🏀添加旋转的缓动动画
     * @param ballNode 球的节点
     * @param startAngle 开始角度
     * @param duration 持续时间(旋转速度)
     */
    private static rotateBall(ballNode: Node, startAngle: number = 0, duration: number = 1.5) {
        tween(ballNode)
            .to(0, { angle: startAngle })
            .to(duration, { angle: 360 + startAngle })
            .union()
            .repeatForever()
            .start();
    }
}


