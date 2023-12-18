import { _decorator, Component, Animation } from 'cc';
import FSMManager from './FSMManager';
const { ccclass} = _decorator;

@ccclass('FSMState')
export default class FSMState {
    /** 状态id (在枚举中的索引) */
    stateID: number = -1;
    /** 持有状态机的组件 */
    stateComponent: Component;
    /** 状态机实例 */
    fsmManager: FSMManager = null;
    /** 动画执行时间 */
    protected duration: number = null;
    /** 动画组件 */
    protected anim: Animation = null;
    /** 动画名称 */
    protected animName: string = null;
    /** 是否需要获取控制权 */
    protected isNeedControl = false

    constructor(stateID: number, stateComponent: Component, fsmManager: FSMManager, animName: string) {
        this.stateID = stateID;
        this.stateComponent = stateComponent;
        this.fsmManager = fsmManager
        this.animName = animName;
        this.initAnim()
    }

    /**
     * 初始化动画相关
     */
    private initAnim() {
        this.anim = this.stateComponent.getComponent(Animation)
        this.duration = this.anim.getState(this.animName).duration
    }

    /** 获取控制权 */
    protected gainControl() {
        this.fsmManager.setIsControl(false)
    }

    /** 释放控制权 */
    protected releaseControl() {
        this.fsmManager.setIsControl(true)
    }

    /** 自动释放控制权(动画执行完毕后) */
    protected autoReleaseControl() {
        setTimeout(()=>{
            this.releaseControl()
        }, this.duration * 1000);
    }

    /** 播放动画 */
    protected playAnim(){
        this.anim.play(this.animName)
    }

    onEnter() {
        this.playAnim()
        if(this.isNeedControl){
            this.gainControl()
            this.autoReleaseControl()
        }
    }

    onUpdate() {}
}

