import { _decorator, Component, Node } from 'cc';
import FSMState from './FSMState';
const { ccclass, property } = _decorator;

@ccclass('FSMManager')
export default class FSMManager {
    stateList: FSMState[] = []
    currentID:number = -1;
    public isControl:boolean = true;

    changeState(stateID:number):void {
        if(this.isControl && this.currentID != stateID){
            this.currentID = stateID;
            this.stateList[stateID].onEnter()
        }
    }

    onUpdate(){
        if(this.currentID != -1){
            this.stateList[this.currentID].onUpdate()
        }
    }

}

