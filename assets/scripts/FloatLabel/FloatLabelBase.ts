import { _decorator, Component, Node, Animation } from 'cc';
import { FloatLabel } from './FloatLabel';
const { ccclass, property } = _decorator;

@ccclass('FloatLabelBase')
export class FloatLabelBase extends Component {

    duration: number = 0

    start() {
        this.duration = this.node.children[0].getComponent(Animation).getState("FloatLabel").duration
        this.autoDestroy()
    }

    initLabel(settingsName:string, value:number){
        this.node.children[0].getComponent(FloatLabel).initLabel(settingsName,value)
    }

    autoDestroy(){
        setTimeout(() => {
            this.node && this.node.destroy()
        }, this.duration * 1000);
    }

}

