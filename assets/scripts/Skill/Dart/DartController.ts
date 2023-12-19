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

        this.spawnSkill();
    }

    /**
     * 释放一次技能, 发射settings内容的飞镖
     */
    static releaseSkill() {
        this.startSkill();
        
    }



    /**
     * 生成skillCount数量的飞镖，随机朝着不同方向前进
     */
    private static spawnSkill() {
 
        let moveDirections = this.generateUniqueDirections(this.settings.skillCount);//获取方向向量组
        for(let i = 0; i < this.settings.skillCount; i++){
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
            /** 添加缓动 */
            this.skillMoving(dartNode, moveDirections[i].multiplyScalar(this.settings.duration));//duration是速度
        }
    }

    /**
     * 朝着某个方向移动，将节点作为参数就可以进行移动
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
     * 获取n个向量的向量组，n由skillCount决定
     * @returns 返回一个向量组，这个向量组里的方向都不同，其中z = 0, x, y在[-1, 0, 1] 随机
     */

    private static generateUniqueDirections(n: number): Vec3[] {
        //维护一个方向数组，在获取n个向量的时候，每次获取都必须与向量组里面的不同
        const directions: Vec3[] = [];
        //内联一个获得随机方向的函数
        const getRandomDirection = (): Vec3 => {
            const getRandomZeroOrOne = () => Math.floor(Math.random() * 3) - 1;
            let x: number, y: number;

            let isOrigin: boolean, isDirectionAlreadyPresent: boolean;
            do {
                x = getRandomZeroOrOne();
                y = getRandomZeroOrOne();
                const isOrigin = x === 0 && y === 0;
                const isDirectionAlreadyPresent = directions.some(direction => direction.equals(new Vec3(x, y, 0)));
                //方向不为0向量且和向量组里的不重复才允许继续获得
            } while (isOrigin || isDirectionAlreadyPresent);
    
            return new Vec3(x, y, 0);
        };  
    
        while (directions.length < n) {
            const newDirection = getRandomDirection();
            directions.push(newDirection);
        }
    
        console.log('directions',directions);
        return directions;
    }
    
    /**
     * 升级技能
     */
    private static upgradeSkill(){
      
    }

    //------------------------------------------------------------------------------------------------------------

   
}
    



