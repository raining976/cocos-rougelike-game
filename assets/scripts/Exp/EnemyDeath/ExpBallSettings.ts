import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ExpBallSettings')
export class ExpBallSettings{
    [index:string]:{
        value:number,
        attr:string,
    }
};
export const ExpBallAttr = new ExpBallSettings();

ExpBallAttr['Big']={
    value:100,
    attr: 'exp',
}

ExpBallAttr['Small']={
    value:10,
    attr: 'exp',
}

ExpBallAttr['HealthBall'] = {
    value: 30,
    attr: 'health',
}



