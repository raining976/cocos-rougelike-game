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
        //1000s后自动删除经验球
        setTimeout(() => {
            this.node.destroy();
        }, 10000);

    }
    update(deltaTime: number) {
    }
}


    

