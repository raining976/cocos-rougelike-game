import { _decorator, Component, Node, Vec3, CCInteger, Animation, input, Input, EventTouch, KeyCode, EventKeyboard, Collider2D, Contact2DType, Collider, IPhysics2DContact } from 'cc';
import { JoyStick } from './JoyStick';
import { Player } from './Player';
import { Enemy } from '../Enemy/Enemy'
import { throttle } from '../utils/util'
import { State } from './State';
const { ccclass, property } = _decorator;

@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {
    //static state=new State();
    @property({type:Node})stateNode: State | null = null;
    @property({ type: Node })
    joyStickPanel: Node | null = null;
    testnumber: number = 0;
    moveStatus: number = 0; // 移动状态 0 静止 1移动
    moveDir: string = null // l左 r右
    
    curDir: Vec3 = new Vec3() // 当前移动方向向量 

    joyStick: JoyStick | null = null;//摇杆控制组件
    playerAttr: Player | null = null;//角色属性组件

    runAnim: Animation = null // 人物动画

    damageDelay: number = 1000; // 碰撞延迟(受到伤害的延迟)

    start() {
        this.runAnim = this.node.getComponent(Animation);
        this.joyStick = this.joyStickPanel.getComponent(JoyStick);
        this.playerAttr = this.node.getComponent(Player);
        this.stateNode.getComponent(State).newExp(this.playerAttr.getCurExp(),this.playerAttr.getMaxExp(),this.playerAttr.getLevel());//更新经验
    }

    onLoad() {
        this.initInputEvent();
        this.initCollider();
    }

    onDestroy() {
        this.destoryInputEvent();
        this.destroyCollider();
    }

    initCollider() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.PRE_SOLVE, throttle(this.onPreSolve, this.damageDelay), this);
        }
    }

    destroyCollider() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
        }
    }

    initInputEvent() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    destoryInputEvent() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onBeginContact(selfCollier: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 经验球捡完就没了 所以碰撞一次就
        if (otherCollider.tag == 2) {
            //TODO: 先默认传 1 后面传经验球表示的经验大小
            this.increaseExp(1);
        }
    }

    /**
     * 碰撞持续回调
     */
    onPreSolve(selfCollier: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // tag=1 代表与小怪碰撞
        if (otherCollider.tag == 1) {
            this.reduceHealth(otherCollider.node.getComponent(Enemy).getdamage());
        }

    }

    /**
     * 在与小怪碰撞后，降低角色血量
     * @param delta 血量降低值
     */
    reduceHealth(delta: number) {
        let newHealth = this.playerAttr.getCurHealth() - delta;
        if (newHealth < 0) {
            alert("game over!!!")
            // TODO: 游戏结束的逻辑
        }
        this.playerAttr.setCurHealth(newHealth);
    }

    /**
     * 与经验球碰撞后，增加经验值
     * @param delta 经验增加值
     */
    increaseExp(delta: number) {
        let newExp = this.playerAttr.getCurExp() + delta;
        if (newExp > this.playerAttr.getMaxExp()) {
            this.improveLevel(newExp - this.playerAttr.getMaxExp());
        } else this.playerAttr.setCurExp(newExp);
        this.stateNode.getComponent(State).newExp(this.playerAttr.getCurExp(),this.playerAttr.getMaxExp(),this.playerAttr.getLevel());
    }

    /**
    * 经验值满后，提升等级
    * @param overflowExp 溢出经验值
    */
    improveLevel(overflowExp: number) {
        //经验、等级
        const playerAttr = this.playerAttr
        this.playerAttr.setLevel(playerAttr.getLevel() + 1)
        this.playerAttr.setMaxExp(playerAttr.getMaxExp() * 2)
        this.playerAttr.setCurExp(overflowExp)
        //属性提升
        //TODO:
        this.stateNode.getComponent(State).newExp(this.playerAttr.getCurExp(),this.playerAttr.getMaxExp(),this.playerAttr.getLevel());
    }

    onKeyDown(e: EventKeyboard) {
        this.changeDir('keyDown', e.keyCode)
    }

    onKeyUp(e: EventKeyboard) {
        this.changeDir('keyUp',e.keyCode)
    }


    /**
     * 更改人物移动方向
     * @param type  keyDown keyUp 表示键盘按下和抬起的两种操作
     * @param code keyCode 按键的code
     */
    changeDir(type: string, code: KeyCode) {
        if (type == 'keyDown') {
            switch (code) {
                case KeyCode.KEY_W:
                    this.curDir.y++
                    break
                case KeyCode.KEY_S:
                    this.curDir.y--
                    break
                case KeyCode.KEY_D:
                    this.curDir.x++
                    break
                case KeyCode.KEY_A:
                    this.curDir.x--
                    break
                default:
                    break
            }
        }
        else if (type == 'keyUp') {
            switch (code) {
                case KeyCode.KEY_W:
                    this.curDir.y--
                    break
                case KeyCode.KEY_S:
                    this.curDir.y++
                    break
                case KeyCode.KEY_D:
                    this.curDir.x--
                    break
                case KeyCode.KEY_A:
                    this.curDir.x++
                    break
                default:
                    break
            }
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
        this.stateNode.getComponent(State).newExp(this.playerAttr.getCurExp(),this.playerAttr.getMaxExp(),this.playerAttr.getLevel());
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


