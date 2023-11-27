import { _decorator, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
import { ExpBallAttr } from './ExpBallSettings';
const { ccclass, property } = _decorator;

@ccclass('ExpBall')
export class ExpBall extends Component {

    protected settings = ExpBallAttr;//敌人属性组配置
    protected value: number; // 经验球值

    start() {
        //根据挂载的预制体的名字决定value
        let expBallName = this.node.name;
        this.init(expBallName)
        this.autoDestroy()
    }

    init(expBallName: string) {
        this.value = this.settings[expBallName].value;
    }

    getValue() {
        return this.value;
    }

    autoDestroy() {
        //10s后自动删除经验球
        setTimeout(() => {
            this.node && this.node.destroy();
        }, 10000);
    }
}




