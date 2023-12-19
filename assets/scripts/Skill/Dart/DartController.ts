import { _decorator, Component, director, Node, Scheduler, tween, Vec3 } from 'cc';
import { SkillController } from '../SkillController';
import { skillSettings } from '../SkillSettings';
import { Skill } from '../Skill';
const { ccclass, property } = _decorator;

@ccclass('DartController')
export class DartController extends SkillController {

    private static skillName = 'Dart';
    private static settings = skillSettings['Dart']; // 技能设置 不知道这里是不是符号传递 有待测试
    private static curDartNodes: Array<Node> = []; // 当前所有的节点




    /**
     * 开始执行技能
     */
    static startSkill() {
        //发射三个飞镖
        for (let i = 0; i < this.settings.skillCount; i++) {
            this.spawnSkill();
        }
    }

    /**
     * 释放一次技能, 发射settings内容的飞镖
     */
    static releaseSkill() {
        this.startSkill();
        
    }



    /**
     * 生成一个飞镖，随机朝着某个方向前进
     */
    private static spawnSkill() {
        /** 从节点池取出并更新技能设置，在释放之前 */
        let dartNode = this.spawnSingleSkill();
        dartNode.getComponent(Skill).initSkill('Dart');
        /** 判断从节点池取出的节点是否已经在curDartNodes里面了 */
        if(this.curDartNodes.indexOf(dartNode) === -1) {
            this.curDartNodes.push(dartNode);
        }
        /** 设置坐标 */
        dartNode.setWorldPosition(this.playerBaseNode.position);
        /** 挂到画布上 */
        director.getScene().getChildByName('Canvas').getChildByName('NodePool').addChild(dartNode);
        /** 计算每次缓动加上的向量, 这里的duration是技能飞行速度 */
        let movePosition = this.getRandomDirection().multiplyScalar(this.settings.duration);
        this.skillMoving(dartNode, movePosition);        
    }

    /**
     * 朝着某个方向移动
     */
    private static skillMoving(dartNode: Node, movePosition: Vec3) {

        //克隆初始位置
        const initialPosition = dartNode.position.clone();
            //朝着给定的方向缓动
            tween(dartNode)
                .by(1,  
                    { position: movePosition}, 
                    //执行自动回收
                    { onUpdate:() => {this.reclaimOutOfRange(dartNode, initialPosition)} } 
                    ) 
                .repeatForever() 
                .start()
    }

    /**
     * 超出范围后回收
     * @param dartNode
     * @param initialPosition: 初始位置
     */
    
    private static reclaimOutOfRange(dartNode: Node, initialPosition: Vec3){
        const currentRange = dartNode.position.subtract(initialPosition).length();
        if(currentRange > this.settings.range){
            this.reclaimSkill(dartNode);
        }
    }


    /**
     * 
     * @returns 随机返回一个三维向量八种可能结果：例如[1, 1, 0], 其中z = 0, x, y在[-1, 0, 1] 随机
     */

    private static getRandomDirection() {
        const getRandomZeroOrOne = () => Math.floor(Math.random() * 3) - 1;

        let x: number, y: number;
        do {
            x = getRandomZeroOrOne();
            y = getRandomZeroOrOne();
        } while (x === 0 && y === 0);
    
        return new Vec3(x, y, 0);
    }
    /**
     * 升级技能
     */
    private static upgradeSkill(){
      
    }

    //------------------------------------------------------------------------------------------------------------

   
}
    



