import { _decorator, Component, Node, Prefab, instantiate, Vec3, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ExpBall')
export class ExpBall extends Component {
    @property(Prefab)
    expBallPrefab: Prefab;  // 经验球的预制体
    @property(Node) private TargetNode:Node;//玩家节点为TargetNode

    generateExpBall() {
         //获取画布范围，画布范围好像是(640, 1000)吧？
        //const canvasSize = new Vec3(640, 1000, 0);

        // 在画布范围内随机生成经验球的位置
        //const randomX = Math.random() * canvasSize.x - canvasSize.x / 2;
        //const randomY = Math.random() * canvasSize.y - canvasSize.y / 2;
        //const position = new Vec3(randomX, randomY, 0);

        // 实例化经验球预制体，并设置位置等信息
        let expBallNode = instantiate(this.expBallPrefab);
        // 将经验球添加到画布
        expBallNode.parent = this.node;
        //获得位置
        let new_position = new Vec3(this.node.position);
        expBallNode.setWorldPosition(new_position);

        // 在3秒后销毁经验球，回调函数，延迟执行，消除节点
        this.scheduleOnce(() => {
            expBallNode.destroy();
        }, 10);
    }

    start() {
        // 调用生成经验球的方法示例
        //this.generateExpBall();
    }

    update(deltaTime: number) {
        // 怪物死亡时生成经验球
        //if (this.isDead()) {
            //this.generateExpBall();
        //}
        // 测试：一直生成经验球
        this.generateExpBall();
    }
    //外部判断
    isDead() {
        // 判断怪物是否死亡，并返回一个布尔值
        return true; // 示例代码，假设怪物始终为死亡状态
    }
}