import { _decorator, Component, director, Node, Scheduler, tween, Vec3, randomRangeInt, dragonBones } from 'cc';
import { SkillController } from '../SkillController';
import { skillSettings } from '../SkillSettings';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('DartController')
export class DartController extends SkillController {
    private static skillName = 'Dart';
    private static settings = skillSettings['Dart']; // 技能设置 不知道这里是不是符号传递 有待测试
    private static curNodes: Node[] = []
    static dirs: Vec3[] = []

    /**
     * 开始执行技能, 内容是对技能按间隔进行释放
     */
    static startSkill() {
        const interval = this.settings.releaseInterval;
        this.startReleaseSkill(interval);
    }

    static unloadSkill(): void {
        this.stopReleaseSkill();
        this.clearAllNodes()
    }
   
    /**
     * 生成skillCount数量的飞镖，随机朝着不同方向前进
     */
    protected static releaseSkill() {
        // this.dirs = []
        let moveDirections = this.generateUniqueDirections();//获取方向向量组
        for (let i = 0; i < this.settings.skillCount; i++) {
            /** 从节点池取出并更新技能设置，在释放之前 */
            let dartNode = this.spawnSingleSkill();
            this.curNodes.push(dartNode)
            dartNode.getComponent(Skill).initSkill(this.skillName); // 升级更新伤害
            dartNode.setWorldPosition(this.playerBaseNode.position); // 设置初始位置
            this.skillNodeContainer.addChild(dartNode);
            // this.skillMoving(dartNode, this.getNewDir()); // 添加缓动动画 duration是速度
            this.skillMoving(dartNode,moveDirections[i])
            let timeouts = this.settings.range / this.settings.duration * 1000//单位是毫秒所以乘1000
            this.autoReclaimSkill(dartNode, timeouts) // 自动回收
        }

        console.table(this.dirs)
    }

    /**
     * 朝着某个方向移动，将节点作为参数就可以进行移动
     * @param dartNode 
     * @param movePosition
     */
    private static skillMoving(dartNode: Node, movePosition: Vec3) {
        //朝着给定的方向缓动
        tween(dartNode)
            .by(1, { position: movePosition.multiplyScalar(this.settings.duration) })
            .repeatForever()
            .start()
    }

    /**
     * 获取n个向量的向量组，n由skillCount决定
     * @returns 返回一个向量组，这个向量组里的方向都不同，其中z = 0 且 x, y在[-1, 0, 1] 随机
     */
    private static generateUniqueDirections(): Vec3[] {
        //维护一个方向数组，在获取n个向量的时候，每次获取都必须与向量组里面的不同
        const n = Math.min(this.settings.skillCount, 8)
        const directions: Vec3[] = [];
        const getRandomZeroOrOne = () => randomRangeInt(-1, 2);
        while (directions.length < n) {
            let curDir: Vec3;
            let isOrigin: boolean, isDirectionAlreadyPresent: boolean;
            do {
                curDir = new Vec3(getRandomZeroOrOne(), getRandomZeroOrOne(), 0);
                isOrigin = curDir.length() == 0
                isDirectionAlreadyPresent = directions.some(direction => direction.equals(curDir));
                //方向不为0向量且和向量组里的不重复才允许继续获得
            } while (isOrigin || isDirectionAlreadyPresent);
            directions.push(curDir)
        }

        return directions;
    }

    /**
     * 生成一个不重复的方向
     * @returns  
     */
    static getNewDir() {
        const getRandomZeroOrOne = () => randomRangeInt(-1, 2);
        let newDir: Vec3;
        let isOrigin: boolean, isDirectionAlreadyPresent: boolean;

        do {
            newDir = new Vec3(getRandomZeroOrOne(), getRandomZeroOrOne(), 0);
            isOrigin = newDir.length() == 0
            isDirectionAlreadyPresent = this.dirs.some(dir => dir.equals(newDir));
            //方向不为0向量且和向量组里的不重复才允许继续获得
        } while (isOrigin || isDirectionAlreadyPresent);
        this.dirs.push(newDir)
        return newDir
    }


    protected static clearAllNodes() {
        if (this.curNodes.length > 0) {
            this.curNodes.forEach(n => {
                this.reclaimSkill(n)
            })
            this.curNodes = []
        }
    }
}




