import { _decorator, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
import { ExpBallAttr } from './ExpBallSettings';
const { ccclass, property } = _decorator;

@ccclass('ExpBall')
export class ExpBall extends Component {

    protected settings = ExpBallAttr;//敌人属性组配置
    protected size: number; // 经验球大小
    protected color: number; // 经验球颜色
    protected value: number; // 经验球值

    start() {
        let expBallName = 'Small'
        this.init(expBallName)
        this.autoDestroy()
    }

    init(expBallName: string) {
        this.size = this.settings[expBallName].size;
        this.color = this.settings[expBallName].color;
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




