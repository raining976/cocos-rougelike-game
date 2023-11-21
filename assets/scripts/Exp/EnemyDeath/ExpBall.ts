import { _decorator, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
import { ExpBallAttr } from './ExpBallSettings';
const { ccclass, property } = _decorator;

@ccclass('ExpBall')
export class ExpBall extends Component {
    
    protected settings=ExpBallAttr;//敌人属性组配置
    protected size:number;
    protected color:number;
    protected value:number;
    
    private elapsedTime: number = 0;    //计时器
    private timerStarted: boolean = false;//标志计时器是否启动


    
    start() {
        //开始计时
        this.timerStarted = false;      //设置为true开始计时，不设置则不计时

    }
    update(deltaTime: number) {
        //自动销毁部分,计时器只执行一次，因此只需要控制标记timeStated即可
        if (this.timerStarted) {
            this.elapsedTime += deltaTime;

            // 检查是否经过了10秒
            if (this.elapsedTime >= 5) {
                this.timerStarted = false; // 停止计时
                this.node.destroy();    //销毁节点
            }
        }
        //这里是其他的行为部分

        
    }

}

