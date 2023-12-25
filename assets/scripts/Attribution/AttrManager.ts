import { _decorator, Component, Node } from 'cc';
import { attrSettings } from './AttrSettings';
import { Player } from '../Player/Player';
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
                let player = this.getComponent(Player);
                player.setCurHealth(player.getCurHealth() + value);
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
    upgradeAttr(attrName: string) {
        const allowUpgrade = attrSettings[attrName].allowUpgrade;
        const nextLevel = attrSettings[attrName].attrLevel + 1
        const upgradeObj = attrSettings[attrName].upgradeArray[nextLevel - 2]
        Object.keys(upgradeObj).forEach(key => {
            if (key != 'description')
                if (allowUpgrade)
                    attrSettings[attrName][key] = upgradeObj[key];
        })
        if (allowUpgrade)
            attrSettings[attrName].attrLevel = nextLevel;
        this.updateAttr(attrName);
    }
}


