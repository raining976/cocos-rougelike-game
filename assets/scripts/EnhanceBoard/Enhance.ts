import { _decorator, Component, Node } from 'cc';
import { ENHANCE_TYPE, enhanceSettings } from './EnhanceSettings';
const { ccclass, property } = _decorator;

@ccclass('Enhance')
export class Enhance {

    private setting = enhanceSettings;
    private type: ENHANCE_TYPE | null = null;
    private name: string | null = null;
    private description: string | null = null;
    private curLevel: number | null = null;
    private maxLevel: number | null = null;

    
    public init(typeEnhance: ENHANCE_TYPE) {
        this.type = this.setting[typeEnhance].type;
        this.name = this.setting[typeEnhance].name;
        this.description = this.setting[typeEnhance].description;
        this.curLevel = 0;
        this.maxLevel = this.setting[typeEnhance].maxLevel;
    }

    public getName() {
        return this.name;
    }

    public setDescription(descriptionNew: string) {
        this.description = descriptionNew;
    }
    public getDescription() {
        return this.description;
    }

    public setCurLevel(curLevelNew: number) {
        this.curLevel = curLevelNew;
    }
    public getCurLevel() {
        return this.curLevel;
    }
    public addCurLevel() {
        this.curLevel++;
    }

}


