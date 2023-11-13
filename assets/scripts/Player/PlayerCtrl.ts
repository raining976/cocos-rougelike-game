import { _decorator, Component, Node, Vec3, CCInteger, Animation, input, Input, EventTouch, KeyCode, EventKeyboard, Collider, ICollisionEvent, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
import { JoyStick } from './JoyStick';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {

    @property({ type: Node })
    joyStickPanel: Node | null = null;

    moveStatus: number = 0; // 移动状态 0 静止 1移动

    moveDir: string = null // l左 r右

    curDir: Vec3 = new Vec3() // 当前移动方向向量 

    joyStick: JoyStick | null = null;//摇杆控制组件
    playerAttr: Player | null = null;//角色属性组件

    runAnim:Animation = null // 人物动画

    start() {
        this.runAnim = this.node.getComponent(Animation)
        this.joyStick = this.joyStickPanel.getComponent(JoyStick);
        this.playerAttr = this.node.getComponent(Player);
        this.initCollid();
    }

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

    }

    /**
     * 键盘按下监听 
     * @param e 
     */
    onKeyDown(e: EventKeyboard) {
        switch (e.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.curDir.y++
                break
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.curDir.y--
                break
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.curDir.x++
                break
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.curDir.x--
                break

        }
    }

    /**
     * 键盘抬起监听
     * @param e 
     */
    onKeyUp(e: EventKeyboard) {
        switch (e.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.curDir.y--
                break
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:

                this.curDir.y++
                break
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.curDir.x--
                break
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.curDir.x++
                break

        }
    }


    update(deltaTime: number) {
        let curDir = this.curDir
        // 先判断需不需要移动
        if (this.isNeedMove(curDir)) {
            this.moveStatus = 1 // 设置移动状态
            let dirBackup = curDir.clone();
            let dis = dirBackup.multiplyScalar(this.playerAttr.getSpeed());
            this.movePlayer(dis)
            this.playAnim()
        } else this.moveStatus = 0
    }

    /**
     * 移动人物
     * @param dis 移动向量
     */
    movePlayer(dis: Vec3) {
        this.node.setPosition(this.node.position.add(dis));
    }

    /**
     * 判断是否需要移动
     * @param v3 当前的方向向量
     * @returns 
     */
    isNeedMove(v3: Vec3) {
        return v3.length() != 0
    }

    /**
     * 返回移动的方向
     * @returns string l左 r右
     */
    getMoveDir() {
        let moveDir
        let v3 = this.curDir
        if (v3.x > 0) moveDir = 'r'
        else if (v3.x < 0) moveDir = 'l'
        else moveDir = this.moveDir
        return moveDir
    }


    /**
     * 播放动画
     * 只有移动方向和上次不一样时才会播放新方向的动画
     */
    playAnim() {
        let curMoveDir = this.getMoveDir()
        if (this.moveDir != curMoveDir) {
            if (curMoveDir == 'r') {
                this.runAnim.play('runRightAnim')
            } else if (curMoveDir == 'l') {
                this.runAnim.play('runLeftAnim')
            }
            this.moveDir = curMoveDir
        }

    }

    initCollid() {
        let colliderCmp = this.node.getComponent(Collider2D);
        colliderCmp.on(Contact2DType.BEGIN_CONTACT, this.onColliding, this);
    }

    onColliding(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        if (otherCollider.tag == 1) {
            let addExp = 10;
            this.playerAttr.addExp(addExp);
        } else if (otherCollider.tag == 0) {
            this.playerAttr.subHealth();
        }
    }
}


