import { _decorator, Component, Node, Vec3, CCInteger,Animation } from 'cc';
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

    moveDir:string = null // l左 r右

    joyStick: JoyStick | null = null;//摇杆控制组件

    runAnim = null


    start() {
        this.runAnim = this.node.getComponent(Animation)
        console.log('this.runAnim',this.runAnim)
        this.joyStick = this.joyStickPanel.getComponent(JoyStick);
    }

    update(deltaTime: number) {
        if(this.isNeedMove(this.joyStick.dir)){
            this.getMoveDir()
            let dirBackup = this.joyStick.dir.clone();
            let dis = dirBackup.multiplyScalar(this.maxSpeed * this.joyStick.ratio);
            this.movePlayer(dis)
            this.playAnim()
        }
    }
    //角色移动
    movePlayer(dis:Vec3) {
            this.node.setPosition(this.node.position.add(dis));
    }

    // 判断是否要移动
    isNeedMove(v3: Vec3) {
        return v3.length() != 0
    }

    // 返回运动方向
    getMoveDir(){
        let v3 = this.joyStick.dir
        if(v3.x > 0) this.moveDir = 'r'
        else if(v3.x < 0) this.moveDir = 'l'
        console.log('this.moveDir',this.moveDir)
    }
    

    // 播放动画
    playAnim(){
        if(this.moveDir == 'r'){
            this.runAnim.play('runRightAnim')
        }else if(this.moveDir == 'l'){

        }
    }


}


