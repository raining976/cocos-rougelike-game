import { _decorator, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
import { ExpBallAttr } from './ExpBallSettings';
const { ccclass, property } = _decorator;

@ccclass('ExpBall')
export class ExpBall extends Component {

    protected settings = ExpBallAttr;//敌人属性组配置
    protected value: number; // 经验球值
    protected attr: string;//增益属性名
    start() {
        //根据挂载的预制体的名字决定value
        let expBallName = this.node.name;
        this.init(expBallName)
        // this.autoDestroy()
    }

    init(expBallName: string) {
        this.value = this.settings[expBallName].value;
        this.attr = this.settings[expBallName].attr;
    }

    getValue() {
        return this.value;
    }

    getAttr() {
        return this.attr;
    }

    
}




