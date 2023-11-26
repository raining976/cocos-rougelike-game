import { _decorator, Component, Node } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('PlayerSettings')
export class PlayerSettings{
    [index: string]: {
        id: string, 
        healthLimit: number,
        damage: number,
        speed: number,
        attackRange: number,
        weaponName: string,
        weaponCount: number
    }
};
export const PlayerAttr = new PlayerSettings();
PlayerAttr['Yellow'] = {
    id: '001',
    healthLimit: 1000,
    damage: 100,
    speed: 3,
    attackRange: 100,
    weaponCount: 4,
    weaponName: 'default'
}


