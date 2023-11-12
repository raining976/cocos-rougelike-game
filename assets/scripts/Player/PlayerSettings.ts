import { _decorator, Component, Node } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('PlayerSettings')
export class PlayerSettings{
    [index: string]: {
        id: string, 
        health: number,
        damage: number,
        speed: number,
        attackrange: number
    }
};
export const PlayerAttr = new PlayerSettings();
PlayerAttr['Yellow'] = {
    id: '001',
    health: 100,
    damage: 100,
    speed: 5,
    attackrange: 100
}


