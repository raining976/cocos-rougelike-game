import { _decorator, Component, Node, Prefab, randomRange,Vec3, instantiate, macro,game, TiledUserNodeData, tween, Tween, randomRangeInt, NodePool, Event,BoxCollider2D} from 'cc';
import { EnemySettings } from './EnemySettings';
import { Enemy } from './Enemy';
import { Randompos } from '../utils/Randompos';
const { ccclass, property } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
    @property(Prefab) private enemies: Prefab[]=[];//引擎内预先注入敌人预制体数组
    @property(Prefab) private Boss: Prefab[]=[];//引擎内预先注入Boss预制体数组
    @property(Node) private TargetNode: Node;//引擎内预先注入目标（玩家）节点
    
    //敌人生成相关参数
    private SpawnerDelay:number=0.2//杂鱼生成延迟
    private BossSpawnerDelay:number=50;//BOSS生成延迟
    
    //对象池相关参数
    private enemyPool: NodePool;//敌人对象池，用于存储和复用敌人节点对象，节省性能开销
    private InitCount:number=50;//对象池容量

    //随机坐标生成器
    private randomposGenerators:Randompos;

    start() {
        //监听器注册
        this.initBossdied();

        //对象池初始化
        this.enemyPool=new NodePool();
        for(let i=0;i<this.InitCount;i++){
            let enemynode=instantiate(this.enemies[randomRangeInt(0, this.enemies.length)]);
            this.enemyPool.put(enemynode);
        }

        //随机坐标生成器初始化
        this.randomposGenerators=new Randompos();
        this.randomposGenerators.setRectangleParameter(100,200,100,200);
        this.randomposGenerators.setCircleParameter(800);

        //生成函数运行
        this.schedule(this.TrashfishSpawner,this.SpawnerDelay,macro.REPEAT_FOREVER);
        this.schedule(this.BossSpawner,this.BossSpawnerDelay,macro.REPEAT_FOREVER);
    }

    /**
     * 杂鱼生成函数
     */
    TrashfishSpawner(){
        let isoldnode:boolean=false;//已使用的节点
        let enemynode=null;
        if(this.enemyPool.size()>0){//若对象池有存对象，则取出
            enemynode=this.enemyPool.get();
            if(enemynode.getComponent("Enemy").Enemyname!=null){
                // console.log(333);
                isoldnode=true;
            }
        }
        else{//否则实例化一个
            enemynode=instantiate(this.enemies[randomRangeInt(0, this.enemies.length)]);
        }
        this.node.addChild(enemynode);//杂鱼节点挂载至当前节点之下
        if(isoldnode==false){
            // console.log(111);
            enemynode.setWorldPosition(this.randomposGenerators.CircularSpawner(this.TargetNode.worldPosition));
            setTimeout(() => {
                enemynode.getComponent("Enemy").patch();
            }, 300);//何等丑陋的处理方式...但是不改碰撞体和对象池的话暂时也只能这么办了
        }
        if(isoldnode==true){
            // console.log(222);
            enemynode.getComponent("Enemy").reset();
        }
    }
    /**
     * Boss生成函数
     */
    BossSpawner(){
        this.node.emit('Boss');
        this.unschedule(this.TrashfishSpawner);
        let Bossnode=null;
        Bossnode=instantiate(this.Boss[randomRangeInt(0, this.Boss.length)]);//实例化boss节点
        Bossnode.setWorldPosition(this.randomposGenerators.IndividualSpawner(this.TargetNode.worldPosition,this.node.worldPosition,0,400));
        this.node.addChild(Bossnode);
    }
     /**
      * Boss死亡的监听函数注册
      */
    initBossdied(){
        this.node.on('Bossdied',(event) => {//注册Boss死亡监听
            this.schedule(this.TrashfishSpawner,this.SpawnerDelay,macro.REPEAT_FOREVER);
        })
    }
    getenemypool(){
        return this.enemyPool;
    }
    gettargetnode(){
        return this.TargetNode;
    }
}




