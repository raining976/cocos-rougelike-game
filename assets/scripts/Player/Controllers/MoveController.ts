import { _decorator, Component, Node, Vec3, Label ,CCInteger, Color,Animation, input, Input, EventTouch, KeyCode, EventKeyboard, Collider2D, Contact2DType, Collider, IPhysics2DContact, RigidBody, ProgressBar ,director} from 'cc';
import { Player } from '../Player';
const { ccclass, property } = _decorator;

@ccclass('MoveController')
export class MoveController extends Component {
    playerEntity:Player

    moveStatus: number = 0; // 移动状态 0 静止 1移动
    moveDir: string = 'r' // l左 r右
    curDir: Vec3 = new Vec3() // 当前移动方向向量 

    playerAnim: Animation = null // 人物动画
    damageDelay: number = 1000; // 碰撞延迟(受到伤害的延迟)

    start() {
        this.playerEntity = this.node.getComponent(Player)
        this.playerAnim = this.node.getComponent(Animation);
    }

    onLoad() {
        this.initInputEvent();
    }

    onDestroy() {
        this.destroyInputEvent();
    }


    initInputEvent() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    destroyInputEvent() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(e: EventKeyboard) {
        this.changeDir('keyDown', e.keyCode)
    }

    onKeyUp(e: EventKeyboard) {
        this.changeDir('keyUp', e.keyCode)
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
            let dis = dirBackup.multiplyScalar(this.playerEntity.getSpeed());
            this.movePlayer(dis)
            this.changePlayerTowards()
            this.playAnim('run')
        } else {
            this.moveStatus = 0
            this.playAnim('idle')
        }
    }

    /**
     * 移动人物
     * @param dis 移动向量
     */
    movePlayer(dis: Vec3) {
        this.node.parent.setPosition(this.node.parent.position.add(dis));
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
     * 修改人物朝向
     */
    changePlayerTowards() {
        let curMoveDir = this.getMoveDir()
        if (this.moveDir != curMoveDir) {
            this.moveDir = curMoveDir
            this.flipNode(curMoveDir)
        }

    }

    /**
     * 将player节点翻转
     * @param dirTxt r l 左右方向
     */
    flipNode(dirTxt: string) {
        if (dirTxt === 'l') this.node.setScale(-1, 1)
        else if (dirTxt === 'r') this.node.setScale(1, 1)
        
    }

    /**
     * 播放动画
     * @param name 动画clip名称
     */
    playAnim(name) {
        if (!this.playerAnim.getState(name).isPlaying)
            this.playerAnim.play(name)
    }

    
}

