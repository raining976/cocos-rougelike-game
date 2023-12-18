import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkillController')
export class SkillController {

    protected static skillPrefab:Prefab; // 当前技能预制体
    protected static nodePool:NodePool // 当前技能的节点池
    protected static playerBaseNode:Node // 人物节点的父节点

    /**
     * 初始化技能
     * @param skillData 技能相关数据 又SkillManager赋予
     */
    static initSkill(skillData:any){
        this.skillPrefab = skillData.skillPrefab
        this.nodePool = skillData.nodePool
        this.playerBaseNode = skillData.playerBaseNode
        this.startSkill()
    }

    /**
     * 开始执行技能 子类应该重写该方法
     */
    static startSkill() {}

    /**
     * 生成一个技能节点(飞行物或者技能实体)
     * 使用节点池生成
     * @returns Node 生成的节点
     */
    protected static spawnSingleSkill() {
        if (this.nodePool.size() > 0) {
            return this.nodePool.get()
        } else
            return instantiate(this.skillPrefab)
    }

    /**
     * 回收目标节点到节点池
     * @param node 目标节点
     */
    protected static reclaimSkill(node: Node) {
        this.nodePool.put(node)
    }







}

