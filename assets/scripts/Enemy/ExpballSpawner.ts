import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { ExpBall } from './ExpBall';
const { ccclass, property } = _decorator;

@ccclass('ExpBallSpawner')
export class ExpBallSpawner extends Component {
    @property(Prefab)
    expBallPrefab: Prefab = null;  // 经验球的预制体

    spawnExpBall() {
        // 实例化经验球预制体
        const expBallNode: Node = instantiate(this.expBallPrefab);

        // 将经验球实例添加到场景中
        const parentNode: Node = this.node; // 将经验球实例添加到当前脚本所挂载节点下
        parentNode.addChild(expBallNode);

        // 获取经验球实例上挂载的脚本组件
        const expBallScript: ExpBall = expBallNode.getComponent(ExpBall);
        if (expBallScript) {
            // 调用经验球脚本的方法
            expBallScript.start();
        }
    }

    // 在适当的时机调用 spawnExpBall() 方法，比如在某个事件响应函数中调用或者在 update() 方法中调用

    // 例如在某个按钮点击事件的响应函数中调用 spawnExpBall() 方法
    onClickSpawnExpBall() {
        this.spawnExpBall();
    }
}