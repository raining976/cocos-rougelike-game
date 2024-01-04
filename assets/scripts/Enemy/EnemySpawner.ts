import { _decorator, Component, Node, Prefab, randomRange, Vec3, instantiate, macro, game, TiledUserNodeData, tween, Tween, randomRangeInt, NodePool, Event, BoxCollider2D } from 'cc';
import { EnemyAttr, EnemySettings } from './EnemySettings';
import { Enemy } from './Enemy';
import { Randompos } from '../utils/Randompos';
import { RandomwithWeight } from '../utils/RandomwithWeight';
const { ccclass, property } = _decorator;

/**
 * 最新更新已弃用Boss相关代码，精英怪请以Enemy内注入的为准
 */
@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
    @property(Prefab) private enemies: Prefab[] = [];//引擎内预先注入敌人预制体数组
    @property(Prefab) private Boss: Prefab[] = [];//引擎内预先注入Boss预制体数组
    @property(Node) private TargetNode: Node;//引擎内预先注入目标（玩家）节点

    //敌人生成相关参数
    private SpawnerDelay: number = 0.1//杂鱼生成延迟
    private BossSpawnerDelay: number = 10;//BOSS生成延迟

    //对象池相关参数
    private enemyPool: NodePool;//敌人对象池，用于存储和复用敌人节点对象，节省性能开销
    private InitCount: number = 50;//对象池容量

    //随机坐标生成器
    private randomposGenerators: Randompos;

    //带权随机
    private randomwithweights_trashfish: RandomwithWeight;//带权随机类对象，该类定义了关于带权随机的一系列方法和权重表
    private weighttop_trashfish: number;//权重区间上限

    /** 当前没有被主动回收的节点 */
    private curEnemyNodes: Node[] = [];

    start() {
        //监听器注册
        // this.initBossdied();

        //权重表初始化
        this.randomwithweights_trashfish = new RandomwithWeight();
        console.log(this.enemies);
        this.randomwithweights_trashfish.init(this.enemies, EnemyAttr, this.enemies);
        // for(let i=0;i<this.enemies.length;i++){
        //     console.log(Array.isArray(EnemyAttr))
        //     console.log(new WeightTable(i,EnemyAttr[this.enemies[i].name].weight))
        //     this.weighttables.push(new WeightTable(i,EnemyAttr[this.enemies[i].name].weight))
        // }
        //权重表更新，更新后的权重值代表对应敌人的带权区间
        this.weighttop_trashfish = this.randomwithweights_trashfish.RangeGenerate();
        // for(let i=1;i<this.weighttables.length;i++){
        //     this.weighttables[i].weight+=this.weighttables[i-1].weight;
        // }
        //对象池初始化
        this.enemyPool = new NodePool();
        for (let i = 0; i < this.InitCount; i++) {
            let enemytype = 0;
            let randomnum = randomRange(0, this.weighttop_trashfish);
            while (randomnum == 0) {
                randomnum = randomRange(0, this.weighttop_trashfish);//cocos没有左开右闭的随机，6
            }
            enemytype = this.randomwithweights_trashfish.location(randomnum)
            let enemynode = instantiate(this.enemies[enemytype]);
            this.enemyPool.put(enemynode);
        }

        //随机坐标生成器初始化
        this.randomposGenerators = new Randompos();
        this.randomposGenerators.setRectangleParameter(100, 200, 100, 200);
        this.randomposGenerators.setCircleParameter(800);

        //生成函数运行
        this.schedule(this.TrashfishSpawner, this.SpawnerDelay, macro.REPEAT_FOREVER);
        // this.schedule(this.BossSpawner,this.BossSpawnerDelay,macro.REPEAT_FOREVER);//原来的代码不打算删除重构了，但又要弃用以适应新的逻辑
    }

    /**
     * 杂鱼生成函数
     */
    TrashfishSpawner() {
        let isoldnode: boolean = false;//已使用的节点
        let enemynode = null;
        if (this.enemyPool.size() > 0) {//若对象池有存对象，则取出
            enemynode = this.enemyPool.get();
            if (enemynode.getComponent("Enemy").Enemyname != null) {
                isoldnode = true;
            }
        }
        else {//否则实例化一个
            let enemytype = 0;
            let randomnum = randomRange(0, this.weighttop_trashfish);
            while (randomnum == 0) {
                randomnum = randomRange(0, this.weighttop_trashfish);//cocos没有左开右闭的随机，6
            }
            enemytype = this.randomwithweights_trashfish.location(randomnum)
            enemynode = instantiate(this.enemies[enemytype]);
        }
        this.curEnemyNodes.push(enemynode)
        this.node.addChild(enemynode);//杂鱼节点挂载至当前节点之下
        enemynode.setWorldPosition(this.randomposGenerators.CircularSpawner(this.TargetNode.worldPosition));
        if (isoldnode == true) {
            enemynode.getComponent("Enemy").reset();
        }
        setTimeout(() => {
            enemynode.getComponent(BoxCollider2D).tag = 1;
        }, 1000);
    }
    /**
     * Boss生成函数
     */
    BossSpawner() {
        this.node.emit('Boss');
        // this.unschedule(this.TrashfishSpawner);
        let Bossnode = null;
        Bossnode = instantiate(this.Boss[randomRangeInt(0, this.Boss.length)]);//实例化boss节点
        Bossnode.setWorldPosition(this.randomposGenerators.IndividualSpawner(this.TargetNode.worldPosition, this.node.worldPosition, 0, 400));
        this.node.addChild(Bossnode);
    }
    /**
     * Boss死亡的监听函数注册
     */
    initBossdied() {
        this.node.on('Bossdied', (event) => {//注册Boss死亡监听
            this.schedule(this.TrashfishSpawner, this.SpawnerDelay, macro.REPEAT_FOREVER);
        })
    }
    getenemypool() {
        return this.enemyPool;
    }
    gettargetnode() {
        return this.TargetNode;
    }

    public Startgenerate() {
        this.schedule(this.TrashfishSpawner, this.SpawnerDelay, macro.REPEAT_FOREVER);
        this.schedule(this.BossSpawner, this.BossSpawnerDelay, macro.REPEAT_FOREVER);
    }
    public Stopgenerate() {
        this.unschedule(this.TrashfishSpawner);
        this.unschedule(this.BossSpawner);
    }
    /**
     * 
     * @returns 带权随机类
     */
    public getrandomwithweights() {
        return this.randomwithweights_trashfish;
    }

    reclaimNode(node: Node) {
        if (node)
            node.getComponent(Enemy).reclaim()
    }

    reclaimAllEnemies() {
        this.curEnemyNodes.forEach(n => {
            this.reclaimNode(n)
        })
        this.curEnemyNodes = []
    }
}




