import { _decorator, Component, EventTouch, input, Input, math, Node, v3, Vec2, Vec3,Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoyStick')
export class JoyStick extends Component {

    @property(Node) player

    @property(Number) maxSpeed = 120 // 角色速度

    

    joyStickBtn: Node = null // 中间按钮节点
    btnCurPos: Vec3 = new Vec3() // 按钮当前位置

    dir: Vec3 = new Vec3() // 移动的方向、单位向量
    dis: Vec3 = new Vec3() // 移动的向量

    bodyAnim :Animation = null
    animClips = null
    runRightAnim = null
    runLeftAnima = null
    
    start() {
        this.joyStickBtn = this.node.children[0]
        // 获取player的动画组件
        this.bodyAnim = this.player.getComponent(Animation)
        console.log('this.bodyAnim',this.bodyAnim)
        this.animClips =  this.bodyAnim.clips
        this.runRightAnim = this.animClips[0]
        console.log('this.runRightAnim',this.animClips)
    }

    onEnable() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {
        let pos = event.getUILocation() // 获取触摸位置
        this.joyStickBtn.setWorldPosition(pos.x, pos.y, 0) // 设置panel的位置为触摸位置

    }

    onTouchMove(event: EventTouch) {
        let posDelta = event.getDelta() // 获取移动距离
        let posDeltaV3 = new Vec3(posDelta.x, posDelta.y, 0) // 声明v3
        this.joyStickBtn.getWorldPosition(this.btnCurPos) // 获取当前btn的位置
        this.joyStickBtn.setWorldPosition(this.btnCurPos.add(posDeltaV3)) // 改变btn位置
        // 获取摇杆移动方向
        this.dir = this.getUnitOfV(this.joyStickBtn.position)
    }

    // 获取btn当前位置占整个panel的比值
    getRatio(btnPosition:Vec3,panelWidth:number){
        let len = this.V3XYMag(btnPosition)
        let maxLen = panelWidth / 2
        return len/maxLen
    }

    // 移动角色
    movePlayer(deltaTime:number) {
        const btnPosition = this.joyStickBtn.position
        const pWidth = this.node.getComponent('cc.UITransform').width/2
        let ratio = this.getRatio(btnPosition,pWidth)
        if (ratio > 1) {
            this.joyStickBtn.setPosition(this.V3XYDiv(this.joyStickBtn.position, ratio))
            ratio = this.getRatio(this.joyStickBtn.position,pWidth)
        }
        // multiplyScalar修改的是this 在当前变量做修改
        let tmpDir = new Vec3(this.dir)
        this.dis = tmpDir.multiplyScalar(this.maxSpeed * ratio * deltaTime)
        this.player.setPosition(this.player.position.add(this.dis))
        if(ratio!=0){
            this.startRunAnim()
        }else{
            this.stopRunAnim()
        }
    }
    // 获取方向向量
    getUnitOfV(v3: Vec3) {
        let len = this.V3XYMag(v3)
        return new Vec3(v3.x / len, v3.y / len, 0)
    }

    onTouchEnd() {
        this.resetPosition()
    }

    onTouchCancel() {
        this.resetPosition()
    }

    resetPosition() {
        this.stopRunAnim()
        // 重置位置
        this.joyStickBtn.setPosition(new Vec3(0, 0, 0))
        this.dir = new Vec3()
        this.dis = new Vec3()
    }

    startRunAnim(){
        const state = this.bodyAnim.getState(this.runRightAnim.name)
        if(!state.isPlaying){
            state.play()
        }
    }
    stopRunAnim(){
        const state = this.bodyAnim.getState(this.runRightAnim.name)
        if(state.isPlaying){
            state.stop()
        }
    }
    
    // 求出 V3里仅xy两个方向向量和的长度
    V3XYMag(pos: Vec3) {
        let x = pos.x
        let y = pos.y
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    }


    // 向量除 只处理xy两个向量
    V3XYDiv(pos: Vec3, ratio: number) {
        let x = pos.x / ratio
        let y = pos.y / ratio
        return new Vec3(x, y, 0)


    }

    update(deltaTime: number) {

        this.movePlayer(deltaTime)

    }
    
}

