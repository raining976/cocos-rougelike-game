import { _decorator, Component, Node } from 'cc';
import { attrSettings } from './AttrSettings';
import { Player } from '../Player/Player';
import { PlayerAttr } from '../Player/PlayerSettings';
import { EnhanceController } from '../EnhanceBoard/EnhanceController';
import { AttrController } from '../Player/Controllers/AttrController';
const { ccclass, property } = _decorator;



@ccclass('AttrManager')
export class AttrManager extends Component {
    /**
     * 更新人物状态
     * @param attrName 属性名称
     */
    updateAttr(attrName: string) {
        console.log('attrName',attrName)
        let value = attrSettings[attrName].attrValue;
        switch(attrName){
            case 'health':
                this.getComponent(Player).setMaxHealth(value);
                break
            case 'speed':
                this.getComponent(Player).setSpeed(value);
                break
            case 'chicken':
                let attrController = this.getComponent(AttrController);
                let maxHealth = this.getComponent(Player).getMaxHealth();
                value = value * 0.01 * maxHealth;
                attrController.increaseHealth(value);
                break
            default:
                console.log("非法的被动技能名");
                break;
        }
    }

    /**
     * 属性升级
     * @param attrName 属性名称
     */
    upgradeAttr(attrName: string, isReset = false) {
        const allowUpgrade = attrSettings[attrName].allowUpgrade;
        let nextLevel = attrSettings[attrName].attrLevel + 1

        if (isReset) nextLevel = 1;

        const upgradeObj = attrSettings[attrName].upgradeArray[nextLevel - 1]
        Object.keys(upgradeObj).forEach(key => {
            if (key != 'description')
                if (allowUpgrade)
                    attrSettings[attrName][key] = upgradeObj[key];
        })
        if (allowUpgrade)
            attrSettings[attrName].attrLevel = nextLevel;
        this.updateAttr(attrName);
    }

    resetAttr() {
        this.getComponent(Player).resetAttr() // 重置属性

        Object.keys(attrSettings).forEach(key => {
            attrSettings[key].attrLevel = 1
        })
    }
}


