import { _decorator, Component, Node } from 'cc';
import { EnemySpawner } from '../Enemy/EnemySpawner';
import { RandomwithWeight } from '../utils/RandomwithWeight';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;
/**
 * 认真想想，这个类没必要实例化第二个，所以都写静态成员变量了
 */
@ccclass('EnemyController')
export class EnemyController {
    private static _enemyspawner: EnemySpawner | null = null;
    private static _instance: EnemyController | null = null;
    private static _EnemyBaseNode: Node | null = null;
    //带权随机
    private static _randomwithweights: RandomwithWeight | null = null;//带权随机类对象，该类定义了关于带权随机的一系列方法和权重表
    public static instance(EnemyBaseNode: Node): EnemyController {//单例模式
        if (!this._instance) {
            this._instance = new EnemyController();
            this._EnemyBaseNode = EnemyBaseNode;
            this._enemyspawner = this._EnemyBaseNode.getComponent(EnemySpawner);
            this._randomwithweights = this._enemyspawner.getrandomwithweights();
        }
        return this._instance;
    }

    //初始化敌人生成
    public static initEnemy() {
        EnemyController._enemyspawner.enabled = true;
    }

    //开始生成敌人
    public static StartEnemy() {
        EnemyController._enemyspawner.Startgenerate();
    }

    //停止生成敌人
    public static StopEnemy() {
        EnemyController._enemyspawner.Stopgenerate();
    }

    /**
     * 设置敌人新权重
     * @param Enemyname 敌人名字
     * @param NewWeight 新权重
     */
    public static setweight(Enemyname: string, NewWeight: number) {
        EnemyController._randomwithweights.RefreshWeight(Enemyname, NewWeight);
    }
}


