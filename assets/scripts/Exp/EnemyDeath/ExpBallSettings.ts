import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ExpBallSettings')
export class ExpBallSettings{
    [index:string]:{
        value:number,
    }
};
export const ExpBallAttr = new ExpBallSettings();

ExpBallAttr['Big']={
    value:100   
}
ExpBallAttr['Small']={
    value:10
}



