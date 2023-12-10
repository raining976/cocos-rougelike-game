import { _decorator, BoxCollider2D, Component, director, instantiate, macro, Node, Prefab, Vec3 } from 'cc';
import { Enemy } from '../Enemy/Enemy';
const { ccclass, property } = _decorator;

//负责释放技能预制体
@ccclass('SkillManager')
export class SkillManager extends Component {
    
    @property(Prefab) private skillPrefabs: Prefab[] = [];//注入技能预制体数组
    @property(Node) private playerNode: Node;
    private skillSpawnDelay:number = 5;
   
    start () { 
        console.log("StartSkillManager")
        /**
         * 定时器，每5秒执行释放一个预制体
         */
        this.schedule(() => {
            this.generateOneSkill();
        }, this.skillSpawnDelay, macro.REPEAT_FOREVER)

    }

    update () {

    }

    /**
     * 释放一个技能预制体
     */

    generateOneSkill(prefabName: string = 'Dart'){
        //在预制体数组内寻找对应的预制体
        let prefab = this.skillPrefabs.find(prefab => prefab.name == prefabName);
        let newSkill = instantiate(prefab);
        newSkill.setPosition(this.playerNode.position);
        this.node.addChild(newSkill);
        //把飞镖预制体放在和 player 平行的节点上


    }

}

