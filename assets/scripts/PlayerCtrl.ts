import { _decorator, Component, Node, Vec3, CCInteger } from 'cc';
import { JoyStick } from './JoyStick';
const { ccclass, property } = _decorator;

@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {

    @property({ type: Node })
    joyStickPanel: Node | null = null;

    @property({ type: CCInteger })
    maxSpeed: number = 0;

    //状态属性，0为静止，1为移动
    @property({ type: CCInteger })
    status: number = 0;

    joyStick: JoyStick | null = null;//摇杆控制组件

    start() {
        this.joyStick = this.joyStickPanel.getComponent(JoyStick);
    }

    update(deltaTime: number) {
        this.movePlayer(deltaTime);
    }
    //角色移动
    movePlayer(deltaTime: number) {
        let dirBackup = this.joyStick.dir.clone();
        let dis = dirBackup.multiplyScalar(this.maxSpeed * this.joyStick.ratio);
        this.node.setPosition(this.node.position.add(dis));
    }
}


