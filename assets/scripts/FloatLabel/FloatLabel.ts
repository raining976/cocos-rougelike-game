import { _decorator, color, Color, Component, Label, Node } from 'cc';
import {labelSettings} from './LabelSettings'
const { ccclass, property } = _decorator;

@ccclass('FloatLabel')
export class FloatLabel extends Component {

    @property(Label) label:Label;

    /**
     * 初始化label的样式和内容
     * @param settingsName labelSettings 的key Player Enemy Exp  
     * @param value label值
     */
    initLabel(settingsName:string, value:number){
        this.setLabelColor(labelSettings[settingsName].color)
        this.setLabelContent(value)
    }

    public getLabelContent(): string { 
        return this.label.string; 
    }

    public setLabelContent(value: number): void {
        this.label.string = value.toString();
    }

    public getLabelColor(): string {
        return this.label.color.toString()
       }

    public setLabelColor(value: string): void {
        this.label.color = new Color(value);
    }
}


