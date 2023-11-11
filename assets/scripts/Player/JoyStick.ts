import { UITransform, CCInteger, _decorator, Component, EventTouch, input, Input, math, Node, v3, Vec2, Vec3, Camera } from 'cc';
import { V2toV3 } from '../util';
const { ccclass, property } = _decorator;

@ccclass('JoyStick')
export class JoyStick extends Component {



    joyStickBtn: Node = null // 中间按钮节点
    dir: Vec3 = new Vec3() // 摇杆移动的方向、单位向量
    maxlen: number | null = null;//中心按钮最大偏移距离
    ratio: number | null = null;//遥感中心按钮偏移比率


    deltaPos :Vec3 = new Vec3()

    camera:Camera = null

    onEnable() {
        /*输入事件on*/
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start() {
        /*获取中间按钮*/
        this.joyStickBtn = this.node.children[0];

        /*获取节点中心按钮最大偏移距离*/
        this.maxlen = this.getComponent(UITransform).width / 2;

        this.deltaPos = this.node.parent.getWorldPosition().subtract(this.node.getWorldPosition())

        this.camera = this.node.parent.children[0].getComponent(Camera)

    }

    update(deltaTime: number) {
        
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
        //获取触点返回的OpenGL坐标.
        let pos_world = V2toV3(event.getUILocation());
        //转换为当前节点的本地坐标
        let pos_local = new Vec3();

       
        
        this.camera.screenToWorld(pos_world,pos_world)
        console.log('pos_world2',pos_world)

        this.node.inverseTransformPoint(pos_local, pos_world);
        console.log('pos_local',pos_local)
        //设置结果
        // this.node.setPosition(this.node.parent.getWorldPosition().subtract(this.deltaPos))
        this.joyStickBtn.setPosition(pos_local);
    
    }

    onTouchMove(event: EventTouch) {
        /*在移动时，不断改变按钮位置*/
        //获取触点本地坐标.
        let posw = V2toV3(event.getUILocation());
        let posl = new Vec3();
        this.node.inverseTransformPoint(posl, posw);
        //获取触点本地坐标的方向.
        Vec3.normalize<Vec3>(this.dir, posl);
        //获取触点本地坐标的长度.
        posl.z = 0; 
        let len = posl.length();
        //根据len的长度判断触点的位置.
        let rat = len <= this.maxlen ? len : this.maxlen;
        //改变中心按钮的位置.
        this.joyStickBtn.setPosition(new Vec3(this.dir.x * rat, this.dir.y * rat, this.dir.z * rat));
        //限制按钮.
        this.restrictBtn();

    }

    onTouchEnd() {
        this.resetPosition();
    }

    onTouchCancel() {
        this.resetPosition();
    }

    // 将中心按钮限制于panel内
    restrictBtn() {
        /*获取ratio，将按钮限制于一定范围内*/
        //获取按钮本地位置向量模长
        let len: number = this.joyStickBtn.getPosition().length();
        //计算得到ration
        this.ratio = len / this.maxlen;
        //执行限制逻辑
        if (this.ratio > 1)
            this.joyStickBtn.setPosition(this.joyStickBtn.position.divide3f(this.ratio, this.ratio, this.ratio));
    }

    //遥感按钮位置重置
    resetPosition() {
        // 重置位置
        this.joyStickBtn.setPosition(new Vec3(0, 0, 0));
        this.dir = new Vec3();
    }


}
