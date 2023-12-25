import { _decorator,  Vec3, Node,  randomRange, tween } from 'cc';
import { SkillController } from '../SkillController';
import { skillSettings } from '../SkillSettings';
const { ccclass } = _decorator;

@ccclass('StraightBallController')
export class StraightBallController extends SkillController {
    private static settings = skillSettings['StraightBall']; // 技能设置 不知道这里是不是符号传递 有待测试

    /**
     * 初始化
     */
    static startSkill() {
        const interval = this.settings.releaseInterval
        this.startReleaseSkill(interval)
    }

    /**
     * 获取一个随机方向
     * @returns Vec3
     */
    private static getRadomDir() {
        const randomNum = () => {
            return randomRange(-1, 1)
        }
        return new Vec3(randomNum(), randomNum(), 0).normalize()
    }

    /**
     * 释放一次技能（完整的一次）
     */
    static releaseSkill(): void {
        /**
         * 生成节点
         * 设置初始坐标，获取随机方向
         * 飞行
         * 回收
         */
        for (let i = 0; i < this.settings.skillCount; i++) {
            const skillNode = this.spawnSingleSkill() // 生成节点
            skillNode.setWorldPosition(this.playerBaseNode.position) // 设置初始位置
            this.skillNodeContainer.addChild(skillNode)
            this.setNodeMoving(skillNode, this.getRadomDir()) // 设置缓动动画
            const range = this.settings.range
            this.autoReclaimSkill(skillNode, range * 10) // 设置自动销毁
        }
    }

    /**
     * 设置节点的移动
     * @param node 要缓动的节点
     * @param dir 移动方向
     */
    private static setNodeMoving(node: Node, dir: Vec3) {
        tween(node)
            .by(0.5, {
                position: dir.multiplyScalar(100)
            })
            .repeatForever()
            .start()
    }




}


