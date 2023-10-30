import { UITransform, CCInteger, _decorator, Component, EventTouch, input, Input, math, Node, v3, Vec2, Vec3 } from 'cc';
import { V2toV3 } from './util';
const { ccclass, property } = _decorator;

@ccclass('JoyStick')
export class JoyStick extends Component {

    @property({ type: Node })
    player: Node | null = null

    @property({ type: CCInteger })
    maxSpeed: number = 0

    joyStickBtn: Node = null // 中间按钮节点
    dir: Vec3 = new Vec3() // 移动的方向、单位向量

    onEnable() {
        /*输入事件on*/
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start() {
        /*获取中间按钮*/
        this.joyStickBtn = this.node.children[0]
    }

    update(deltaTime: number) {
        this.movePlayer(deltaTime)
    }

    onDisable() {
        /*输入事件off*/
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {
        /*触碰按钮时，根据触点设置节点位置*/
        //获取触点返回的世界坐标.
        let pos_world = V2toV3(event.getUILocation());
        //转换为本地坐标
        let pos_local = new Vec3();
        this.node.inverseTransformPoint(pos_local, pos_world);
        //设置结果
        this.joyStickBtn.setPosition(pos_local);
    }

    onTouchMove(event: EventTouch) {
        /*在移动时，不断改变按钮位置*/
        //获取触点本地坐标
        let posw = V2toV3(event.getUILocation());
        let posl = new Vec3();
        this.node.inverseTransformPoint(posl, posw);
        //改变位置
        let posDelta = event.getUIDelta();
        this.joyStickBtn.setPosition(this.joyStickBtn.position.add(V2toV3(posDelta)));
        
        /*获取遥感移动方向*/
        Vec3.normalize<Vec3>(this.dir, this.joyStickBtn.getPosition());
    }

    onTouchEnd() {
        this.resetPosition();
    }

    onTouchCancel() {
        this.resetPosition();
    }

    // 角色移动
    movePlayer(deltaTime:number) {
        /*获取ratio，将按钮限制于一定范围内*/
        //获取按钮本地位置向量模长
        let len: number = this.joyStickBtn.getPosition().length();
        //获取最大模长
        let maxlen: number = this.getComponent(UITransform).width / 2;
        //计算得到ration
        let ratio: number = len / maxlen;
        //执行限制逻辑
        if (ratio > 1)
            this.joyStickBtn.setPosition(this.joyStickBtn.position.divide3f(ratio, ratio, ratio));
        
        /*根据方向dir移动角色*/
        let dirBackup = this.dir.clone();
        let dis = dirBackup.multiplyScalar(this.maxSpeed * ratio);//zrn在这写了个this.maxSpeed * ratio * deltaTime
        this.player.setPosition(this.player.position.add(dis));
    }

    //遥感按钮位置重置
    resetPosition() {
        // 重置位置
        this.joyStickBtn.setPosition(new Vec3(0, 0, 0));
        this.dir = new Vec3();
    }
}

