import { _decorator, CircleCollider2D, Component, director, Node, NodePool, Prefab, tween, UITransform } from 'cc';
import { SkillController } from '../SkillController';
import { skillSettings } from '../SkillSettings';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('SpinBallController')
export class SpinBallController extends SkillController {
    private static skillName = 'SpinBall';
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
        const targetCount = this.settings.skillCount
        for (let i = 0; i < targetCount - len; i++) {
            let node = this.spawnSingleSkill()
            this.playerBaseNode.addChild(node)
            this.curBallNodes.push(node)
        }
        this.setNodes()
    }

    /**
     * 设置节点的相关信息 包括锚点(范围) 旋转等等
     */
    private static setNodes() {
        let len = this.curBallNodes.length
        let deltaAngle = 360 / len
        const range = this.settings.range / 100
        for (let i = 0; i < len; i++) {
            const ballNode = this.curBallNodes[i]
            ballNode.getComponent(Skill).initSkill(this.skillName) // 避免升级后无法更新
            ballNode.getComponent(UITransform).setAnchorPoint(0.5, -3 * range) // 修改范围
            const contentSize = ballNode.getComponent(UITransform).width // 获取大小
            const anchorY = ballNode.getComponent(UITransform).anchorY
            ballNode.getComponent(CircleCollider2D).offset.y = contentSize * -anchorY + contentSize/2 // 修改碰撞体的偏移量
            this.rotateBall(ballNode, deltaAngle * i) // 更新缓动函数
        }
    }

    /**
     * 给🏀添加旋转的缓动动画
     * @param ballNode 球的节点
     * @param startAngle 开始角度
     * @param duration 持续时间(旋转速度)
     */
    private static rotateBall(ballNode: Node, startAngle: number = 0) {
        const duration = skillSettings[this.skillName].duration || 2
        tween(ballNode)
            .to(0, { angle: startAngle })
            .to(duration, { angle: 360 + startAngle })
            .union()
            .repeatForever()
            .start();
    }

    




}

