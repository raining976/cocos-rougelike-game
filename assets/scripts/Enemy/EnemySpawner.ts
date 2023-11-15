import { _decorator, Component, Node, Prefab, randomRange,Vec3, instantiate, macro,game, TiledUserNodeData, tween, Tween, randomRangeInt, NodePool, Event} from 'cc';
import { EnemySettings } from './EnemySettings';
import { Enemy } from './Enemy';
import { Myevent } from '../Myevent';
const { ccclass, property } = _decorator;

@ccclass('EnemySpanwner')
export class EnemySpanwner extends Component {
    @property(Prefab) private enemies: Prefab[]=[];//引擎内预先注入敌人预制体数组
    @property(Prefab) private Boss: Prefab[]=[];//引擎内预先注入Boss预制体数组
    @property(Node) private TargetNode:Node;//引擎内预先注入目标（玩家）节点
    
    //敌人生成相关参数
    private SpawnerDelay:number=0.5;//杂鱼生成延迟
    private BossSpawnerDelay:number=10;//BOSS生成延迟
    
    // private eventTargetlisten=new EventTarget();
    //对象池相关参数
    private enemyPool: NodePool;//敌人对象池，用于存储和复用敌人节点对象，节省性能开销
    private InitCount:number=50;//对象池容量

    start() {
        
        this.enemyPool=new NodePool();
        for(let i=0;i<this.InitCount;i++){
            let enemynode=instantiate(this.enemies[randomRangeInt(0, this.enemies.length)]);
            this.enemyPool.put(enemynode);
        }
        this.schedule(this.TrashfishSpawner,this.SpawnerDelay,macro.REPEAT_FOREVER);
        this.schedule(this.BossSpawner,this.BossSpawnerDelay,macro.REPEAT_FOREVER);
        // this.unscheduleAllCallbacks()
    }

    update(deltaTime: number) {
        // this.node.on('Boss',(event) => {
        //     console.log("捕获");
        // })
    }
    /**
     * 杂鱼生成函数
     */
    TrashfishSpawner(){
        const posX: number = randomRange(640, 1000) * (Math.random() < 0.5 ? 1 : -1);
        const posY: number = randomRange(640, 1000) * (Math.random() < 0.5 ? 1 : -1);
        const spawnPosition = new Vec3();
        spawnPosition.x = this.TargetNode.worldPosition.x + posX-this.node.worldPosition.x;
        spawnPosition.y = this.TargetNode.worldPosition.y + posY-this.node.worldPosition.y;
        let enemynode=null;
        if(this.enemyPool.size()>0){
            enemynode=this.enemyPool.get();
            if(enemynode.getComponent("Enemy").Enemyname!=null){
                enemynode.getComponent("Enemy").reset();
            }
        }
        else{
            enemynode=instantiate(this.enemies[randomRangeInt(0, this.enemies.length)]);
        }
        enemynode.setWorldPosition(spawnPosition);
        this.node.addChild(enemynode);
    }
    /**
     * Boss生成函数
     */
    BossSpawner(){
        this.node.emit('Boss');
        this.unschedule(this.TrashfishSpawner);
        // this.eventTargetspeak.dispatchEvent(new Myevent('Boss',true));
        const posX=0;
        const posY=400;
        const spawnPosition = new Vec3();
        spawnPosition.x = this.TargetNode.worldPosition.x + posX-this.node.worldPosition.x;
        spawnPosition.y = this.TargetNode.worldPosition.y + posY-this.node.worldPosition.y;
        let Bossnode=null;
        Bossnode=instantiate(this.Boss[randomRangeInt(0, this.Boss.length)]);
        Bossnode.setWorldPosition(spawnPosition);
        this.node.addChild(Bossnode);
    }
}




