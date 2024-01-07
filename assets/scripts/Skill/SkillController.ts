import { _decorator, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass } = _decorator;

@ccclass('SkillController')
export class SkillController {

    /** 当前技能的预制体 */
    protected static skillPrefab: Prefab;
    /** 当前技能的节点池 */
    protected static nodePool: NodePool
    /** 人物节点的父节点 playerBase */
    protected static playerBaseNode: Node
    /** 技能节点容器 */
    protected static skillNodeContainer: Node
    /** 技能释放的定时器 */
    protected static timer = null;

    /**
     * 初始化技能相关的预制体、节点池等
     * @param skillData 技能相关数据 又SkillManager赋予
     */
    static initSkill(skillData: any) {
        this.skillPrefab = skillData.skillPrefab
        this.nodePool = skillData.nodePool
        this.playerBaseNode = skillData.playerBaseNode
        this.skillNodeContainer = skillData.skillNodeContainer
        this.startSkill()
    }

    /**
     * 启动技能 子类应该重写该方法
     * ⚠️注意:要保证技能升级后调用此方法时对应的技能属性在每个技能节点都得到了更新
     * 也就是说 这个方法既是 start 也是 restart
     * @example
     * // 子类中
     * static startSkill(){
     *      const interval = getInterval() // 获取这个技能的释放间隔
     *      this.startReleaseSkill(interval);
     *      // 其他差异化操作也可以写
     * }
     */
    static startSkill() { }

    static unloadSkill() { }

    static pauseSkill() {
        this.stopReleaseSkill()
    }

    /**
     * 释放一次技能 子类应该重写此方法
     * 这里实现的是一次完整的释放技能 比如这次技能释放了3个火球 火球持续了多久
     */
    protected static releaseSkill() { }

    /**
     * 开始自动释放技能 每隔多少毫秒释放一次技能
     * @param interval 技能冷却时间(ms) 每隔多少毫秒释放一次技能 应该从 skillSettings中获取对应的interval
     */
    protected static startReleaseSkill(interval: number) {
        this.stopReleaseSkill() // ⚠️避免内存泄露
        this.timer = setInterval(() => {
            this.releaseSkill()
        }, interval)
    }

    /**
     * 停止自动释放技能 清空定时器
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
        if (node) this.nodePool.put(node)
    }

    /**
     * 自动回收技能节点 (单个)
     * @param node 本次回收的技能节点
     * @param timeouts 多少秒后回收本次技能节点 ms
     */
    protected static autoReclaimSkill(node: Node, timeouts: number) {
        if (node) {
            setTimeout(() => {
                this.reclaimSkill(node)
            }, timeouts)
        }
    }

    /** 清空所有已经释放的技能 用于重新开始的时候*/
    // protected static clearAllNodes() {
    //     if (this.curNodes.length > 0) {
    //         this.curNodes.forEach(n => {
    //             this.reclaimSkill(n)
    //         })
    //         this.curNodes = []
    //     }
    // }
}

