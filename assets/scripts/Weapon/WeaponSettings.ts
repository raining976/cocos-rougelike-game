import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WeaponSettings')
export class WeaponSettings extends Component {
    [index: string]: {
        id: string,
        damage: number
    };


}

export const WeaponAttr = new WeaponSettings();
WeaponAttr['default'] = {
    id: '001',
    damage: 10
}
