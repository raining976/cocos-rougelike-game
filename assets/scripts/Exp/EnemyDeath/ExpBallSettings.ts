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
export const ExpBallAttr = new ExpBallSettings();

ExpBallAttr['Big']={
    value:100,
    color:1,
    size:2
}
ExpBallAttr['Small']={
    value:10,
    color:2,
    size:1
}



