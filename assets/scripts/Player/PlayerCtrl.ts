import { _decorator, Component, Node, Color,Vec3, CCInteger, Animation, input, Input, EventTouch, KeyCode, EventKeyboard, Collider2D, Contact2DType, Collider, IPhysics2DContact, Sprite, Label } from 'cc';
import { Player } from './Player';
import { Enemy } from '../Enemy/Enemy'
import { throttle } from '../utils/util'
import { State } from './State';
const { ccclass, property } = _decorator;

@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {
    @property({ type: Node }) stateNode = null // 人物状态节点
    @property({ type: Sprite })bloodBar = null//人物血条


    moveStatus: number = 0; // 移动状态 0 静止 1移动
    moveDir: string = null // l左 r右
    curDir: Vec3 = new Vec3() // 当前移动方向向量 
    playerAttr: Player | null = null;//角色属性组件
    playerAnim: Animation = null // 人物动画
    damageDelay: number = 1000; // 碰撞延迟(受到伤害的延迟)
    stateEntity:State = null // 人物状态实体类
    hurt:Label | null=null//受到伤害标签
    

    
    start() {
        this.bloodBar=this.node.getChildByName("bloodBar");
        this.hurt=this.bloodBar.getChildByName("hurt").getComponent(Label);
        this.updateHurt(100);//用于调试
        
        this.playerAnim = this.node.getComponent(Animation);
        this.playerAttr = this.node.getComponent(Player);
        this.stateEntity = this.stateNode.getComponent(State)
        this.updateStateLabel()   
    }

    /**
     * 更新人物状态label
     */
    updateStateLabel(){
        this.stateEntity.setAll(this.playerAttr.getLevel(),this.playerAttr.getCurExp(),this.playerAttr.getMaxExp())
    }
   
    /**
     * 显示掉血量
     */
    updateHurt(delta:number){
        this.hurt.string="-"+delta.toString();
        this.hurt.color=new Color(255,0,0,255);
        setTimeout(()=>{//显示两秒后消失
            this.hurt.color=new Color(255,0,0,0);
        },2000)
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
        // if (otherCollider.tag == 1) {
        //     this.reduceHealth(otherCollider.node.getComponent(Enemy).getdamage());
        // }
    }


    onPreSolve(selfCollier: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // tag=1 代表与小怪碰撞
        // if (otherCollider.tag == 1) {
        //     this.reduceHealth(otherCollider.node.getComponent(Enemy).getdamage());
        // }

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
        this.updateHurt(delta);
    }

    /**
     * 与经验球碰撞后，增加经验值
     * @param delta 经验增加值
     */
    increaseExp(delta: number) {
        let newExp = this.playerAttr.getCurExp() + delta;
        if (newExp > this.playerAttr.getMaxExp()) {
            this.improveLevel(newExp - this.playerAttr.getMaxExp());
        } else {     
            this.playerAttr.setCurExp(newExp);
            this.stateEntity.setCurExpLabel(newExp)
         }

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
        this.updateStateLabel()
        //属性提升
        //TODO:
        this.stateNode.getComponent(State).newExp(this.playerAttr.getCurExp(),this.playerAttr.getMaxExp(),this.playerAttr.getLevel());
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
        let curDir = this.curDir;
        // 先判断需不需要移动
        if (this.isNeedMove(curDir)) {
            this.moveStatus = 1 // 设置移动状态
            let dirBackup = curDir.clone();
            let dis = dirBackup.multiplyScalar(this.playerAttr.getSpeed());
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
     * 修改人物朝向
     * 保证人物血条不翻转
     */
    changePlayerTowards() {
        let curMoveDir = this.getMoveDir()
        if (this.moveDir != curMoveDir) {
            if (curMoveDir == 'r') {
                // this.runAnim.play('runRightAnim')
                this.node.scale.x = 1;
                this.bloodBar.scale.x=1;
            } else if (curMoveDir == 'l') {
                // this.runAnim.play('runLeftAnim')
                this.node.scale.x = -1;
                this.bloodBar.scale.x=-1;
            }
            this.moveDir = curMoveDir
        }

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


