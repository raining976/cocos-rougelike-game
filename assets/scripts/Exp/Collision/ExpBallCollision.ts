import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ExpBallCollision')
export class ExpBallCollision extends Component {

    private shouldDestroy: boolean = false;//设置是否需要销毁标值位
    start() {

    }

    update(deltaTime: number) {
        if (this.shouldDestroy) {
            this.destroyExpBall(this.node);
        }
    }
    onCollisionEnter(event) {
        const otherCollider = event.otherCollider;

        if (otherCollider.node.name === 'Player') {
            // 处理碰撞逻辑，例如增加经验值
            //  这里添加Player的回调函数
            // 销毁经验球预制体
            this.destroyExpBall(this.node);
            this.shouldDestroy = true;
        }

    }

    destroyExpBall(expBallNode: Node) {
        // 实际项目中，你可能需要播放一些特效或其他操作
        expBallNode.destroy();
    }
}

