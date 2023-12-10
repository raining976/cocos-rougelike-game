import { _decorator, Color, color, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LabelSettings')
class LabelSettings {
    [nodeScriptName:string]:{
        color:string;
    }
}

export const labelSettings = new LabelSettings();
labelSettings['Enemy'] = {
    color: "#fdeaa1"
}
labelSettings['Player'] = {
    color: "#C53F3A"
}
labelSettings['Exp'] = {
    color: '#B2C1CA'
}