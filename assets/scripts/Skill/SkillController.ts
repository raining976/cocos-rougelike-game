import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkillController')
export class SkillController {

    /** 当前技能的预制体 */
    protected static skillPrefab: Prefab;
    /** 当前技能的节点池 */
    protected static nodePool: NodePool
    /** 人物节点的父节点 playerBase */
    protected static playerBaseNode: Node // 人物节点的父节点
    /** 技能释放的定时器 */
    protected static timer = null;

    /**
     * 初始化技能
     * @param skillData 技能相关数据 又SkillManager赋予
     */
    static initSkill(skillData: any) {
        this.skillPrefab = skillData.skillPrefab
        this.nodePool = skillData.nodePool
        this.playerBaseNode = skillData.playerBaseNode
        this.startSkill()
    }

    /**
     * 启动技能 子类应该重写该方法
     * ⚠️注意:要保证技能升级后调用此方法时对应的技能属性在每个技能节点都得到了更新
     */
    static startSkill() { }

    /**
     * 释放一次技能 子类应该重写此方法
     */
    protected static releaseSkill() { }

    /**
     * 开始释放技能
     * @param interval 技能冷却时间(ms) 每隔多少毫秒释放一次技能 应该从 skillSettings中获取对应的interval
     */
    protected static startReleaseSkill(interval: number) {
        this.stopReleaseSkill() // ⚠️避免内存泄露
        this.timer = setInterval(()=>{
            this.releaseSkill()
        }, interval)
    }

    /**
     * 停止释放技能 清空定时器
     */
    protected static stopReleaseSkill() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }

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

