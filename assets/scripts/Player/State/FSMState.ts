import { _decorator, Component, Node } from 'cc';
import FSMManager from './FSMManager';
const { ccclass, property } = _decorator;

@ccclass('FSMState')
export default class FSMState  {
    stateID:number = -1;
    stateComponent:Component;
    fsmManager:FSMManager = null;

    constructor(stateID:number, stateComponent:Component,fsmManager:FSMManager) {
        this.stateID = stateID;
        this.stateComponent = stateComponent;
        this.fsmManager = fsmManager
    }

    setManagerControl(control:boolean){
        this.fsmManager.isControl = control;
    }

    onEnter(){}
    onUpdate(){}
}

