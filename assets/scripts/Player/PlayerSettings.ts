import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerSettings')
export class PlayerSettings{
    [index: string]: {
        id: string, 
        healthLimit: number,
        damage: number,
        speed: number,
        weaponName: string,
        weaponCount: number
    }
};
export const PlayerAttr = new PlayerSettings();
PlayerAttr['Yellow'] = {
    id: '001',
    healthLimit: 500,
    damage: 100,
    speed: 3,
    weaponCount: 4,
    weaponName: 'default'
}


