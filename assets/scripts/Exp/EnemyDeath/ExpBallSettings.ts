import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ExpBallSettings')
export class ExpBallSettings{
    [index:string]:{
        value:number,
        color:number,
        size:number,
    }
};
export const ExpBallAttr=new ExpBallSettings();

