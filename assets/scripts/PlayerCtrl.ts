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
    moveStatus: number = 0;

    moveDir:string = null // l左 r右

    joyStick: JoyStick | null = null;//摇杆控制组件

    runAnim = null


    start() {
        this.runAnim = this.node.getComponent(Animation)
        this.joyStick = this.joyStickPanel.getComponent(JoyStick);
    }

    update(deltaTime: number) {
        if(this.isNeedMove(this.joyStick.dir)){
            this.moveStatus = 1
            let dirBackup = this.joyStick.dir.clone();
            let dis = dirBackup.multiplyScalar(this.maxSpeed * this.joyStick.ratio);
            this.movePlayer(dis)
            // this.setPanelPos()
            this.playAnim()
        }else this.moveStatus = 0
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
        let moveDir
        let v3 = this.joyStick.dir
        if(v3.x > 0) moveDir = 'r'
        else if(v3.x < 0) moveDir = 'l'
        else moveDir = this.moveDir
        return moveDir
    }
    

    // 播放动画
    playAnim(){
        let curMoveDir  = this.getMoveDir()
        if(this.moveDir != curMoveDir){
            if(curMoveDir == 'r' ){
                this.runAnim.play('runRightAnim')
            }else if(curMoveDir == 'l'){
                this.runAnim.play('runLeftAnim')
            }
            this.moveDir = this.getMoveDir()
        }
        
    }

    setPanelPos(){
        let deltaPos = this.joyStickPanel.worldPosition.subtract(this.node.worldPosition)
        this.joyStickPanel.setPosition(deltaPos)
       
    }


}


