import { _decorator, Component, Node, Vec3, CCInteger, Animation, input, Input, EventTouch, KeyCode, EventKeyboard, Collider2D, Contact2DType, Collider, IPhysics2DContact } from 'cc';
import { JoyStick } from './JoyStick';
import { Player } from './Player';
import { Enemy } from '../Enemy/Enemy'
import { throttle } from '../utils/util'
const { ccclass, property } = _decorator;

@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {

    @property({ type: Node })
    joyStickPanel: Node | null = null;
    testnumber: number = 0;
    moveStatus: number = 0; // 移动状态 0 静止 1移动
    moveDir: string = null // l左 r右

    curDir: Vec3 = new Vec3() // 当前移动方向向量 

    joyStick: JoyStick | null = null;//摇杆控制组件
    playerAttr: Player | null = null;//角色属性组件

    runAnim: Animation = null // 人物动画

    damageDelay: number = 1;
    start() {
        this.runAnim = this.node.getComponent(Animation);
        this.joyStick = this.joyStickPanel.getComponent(JoyStick);
        this.playerAttr = this.node.getComponent(Player);

        //自定义定时器
        this.schedule(this.reduceHealth, this.damageDelay, )
    }

    onLoad() {
        this.initInputEvent();
        this.initCollider();
    }

    onDestroy() {
        this.destoryInputEvent();
        this.destroyCollider();
    }

    /**
     * 注册碰撞事件
     */
    initCollider() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
        }
    }

    /**
     * 销毁碰撞事件
     */
    destroyCollider() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
        }
    }

    /**
     * 注册输入事件
     */
    initInputEvent() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    /**
     * 销毁输入事件
     */
    destoryInputEvent() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    /**
     * 初次碰撞回调
     */
    onBeginContact(selfCollier: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // //tag=1 代表与小怪碰撞 tag=2 代表与经验球碰撞
        // if (otherCollider.tag == 1) {
        //     this.reduceHealth(otherCollider.node.getComponent(Enemy).getdamage());
        // } else if (otherCollider.tag == 2) {
        //     //TODO:等经验球做完后，调整这里传递的参数
        //     this.increaseExp(1);
        // }
    }

    /**
     * 碰撞持续回调
     * @param selfCollier
     * @param otherCollider 
     * @param contact 
     */
    onPreSolve(selfCollier: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        //tag=1 代表与小怪碰撞 tag=2 代表与经验球碰撞
        // if (otherCollider.tag == 1) {
        //     this.reduceHealth(otherCollider.node.getComponent(Enemy).getdamage());
        // } else if (otherCollider.tag == 2) {
        //     //TODO:等经验球做完后，调整这里传递的参数
        //     this.increaseExp(1);
        // }


        
       
        console.log('test')
       
        throttle(this.test)
    }

     test(t:number = 1) {
        console.log('this.testnumber')
    }
    /**
     * 在与小怪碰撞后，降低角色血量
     * @param delt 血量降低值
     */
    reduceHealth(delt: number) {
        let newHealth = this.playerAttr.getCurHealth() - delt;
        if (newHealth < 0) {
            console.log("Game over");
        }
        this.playerAttr.setCurHealth(newHealth);
    }

    /**
     * 与经验值碰撞后，增加经验值
     * @param delt 经验增加值
     */
    increaseExp(delt: number) {
        let newExp = this.playerAttr.getCurExp();
        if (newExp > this.playerAttr.getMaxExp()) {
            this.playerAttr.improveLevel(newExp - this.playerAttr.getMaxExp());
        }
        this.playerAttr.setCurExp(newExp);
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
}


