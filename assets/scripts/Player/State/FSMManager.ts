import { _decorator } from 'cc';
import FSMState from './FSMState';
const { ccclass } = _decorator;

@ccclass('FSMManager')
export default class FSMManager {
    /** 状态实例数组 */
    stateList: FSMState[] = []
    /** 当前状态id */
    currentID: number = -1;
    /** 控制权 true表示有控制权 */
    private isControl: boolean = true;
    setIsControl(value: boolean): void {
        this.isControl = value;
    }

    /**
     * 修改状态
     * @param stateID 状态id
     */
    changeState(stateID: number): void {
        if (this.isControl && this.currentID != stateID) {
            this.currentID = stateID;
            this.stateList[stateID].onEnter()
        }
    }

}

