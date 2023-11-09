import { _decorator, Component, Node, Prefab, randomRange,Vec3, instantiate, macro,game, TiledUserNodeData, tween, Tween, randomRangeInt, NodePool} from 'cc';
import { EnemySettings } from './EnemySettings';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('EnemySpanwner')
export class EnemySpanwner extends Component {
    @property(Prefab) private enemies: Prefab[]=[];//引擎内预先注入敌人预制体数组
    @property(Node) private TargetNode:Node;//引擎内预先注入目标（玩家）节点
    // private TargetNode:Node;
    // private IdToSettings=new Map<string,EnemySettings>();

    //敌人生成相关参数
    private curDelay:number=0;//生成器计时
    private SpanwnerDelay:number=1;//怪物生成延迟

    //状态机AI相关参数
    private interval:number=0.1;//状态机AI思考间隔
    private AIdelay:number=0;//状态机AI思考延迟
    private attackdelay:number=0.1;//伤害判定延迟

    //对象池相关参数
    private enemyPool: NodePool;//敌人对象池，用于存储和复用敌人节点对象，节省性能开销
    private InitCount:number=50;//对象池容量
    start() {
        this.enemyPool=new NodePool();
        for(let i=0;i<this.InitCount;i++){
            let enemynode=instantiate(this.enemies[randomRangeInt(0, this.enemies.length)]);
            this.enemyPool.put(enemynode);
        }
        console.log(this);
    }

    update(deltaTime: number) {
        this.curDelay+=deltaTime;
        if(this.curDelay>this.SpanwnerDelay){
            this.curDelay=0;
            const posX: number = randomRange(360, 1000) * (Math.random() < 0.5 ? 1 : -1);
            const posY: number = randomRange(640, 1000) * (Math.random() < 0.5 ? 1 : -1);
            const spawnPosition = new Vec3();
            spawnPosition.x = this.TargetNode.worldPosition.x + posX-this.node.worldPosition.x;
            spawnPosition.y = this.TargetNode.worldPosition.y + posY-this.node.worldPosition.y;
            // console.log(this.enemies[0]);
            let enemynode=null;
            if(this.enemyPool.size()>0){
                enemynode=this.enemyPool.get();
            }
            else{
                enemynode=instantiate(this.enemies[randomRangeInt(0, this.enemies.length)]);
            }
            enemynode.setWorldPosition(spawnPosition);
            // const one_enmey=enemynode.addComponent(Enemy)//敌人配置读取
            this.node.addChild(enemynode);
            this.schedule(this.StateAI.bind(enemynode,this.TargetNode),this.interval,macro.REPEAT_FOREVER,this.AIdelay);
        }
        
    }

    //状态机AI，以一定间隔进行思考执行动作
    StateAI(targetnode:Node){
        const enemytype=this.getComponent(Enemy);
        // console.log("this is: ",enemytype.getspeed());
        // console.log(enemytype.getblood());当前对象血量
        // console.log(this.parent.getComponent("EnemySpanwner").enemyPool);对象池
        if(enemytype.getblood()<=0){
            console.log(this.parent.getComponent("EnemySpanwner").enemyPool);
            // this.parent.getComponent("EnemySpanwner").enemyPool.put(this);
            // console.log(this.parent.getComponent("EnemySpanwner").enemyPool);
            return;
        }
        if(targetnode ==null){//目标节点不存在
            return;
        }

        // if(targetnode.curState =="Die"){//玩家已死亡
        //     return;
        // }

        const distance=Vec3.distance(this.worldPosition,targetnode.worldPosition);//攻击间隔判定//不用管报错，VScode这里识别不出bind绑定
        const time=distance/enemytype.getspeed();
        let temp=new Vec3();
            Vec3.subtract(temp, targetnode.worldPosition, this.worldPosition);
            temp.normalize();//归一化方向向量
            // console.log("temp1= ",temp);
            Vec3.multiplyScalar(temp,temp,enemytype.getattackrange());
            // console.log("temp2= ",temp);
        Vec3.subtract(temp,targetnode.worldPosition,temp);
            tween(this).to(time,{worldPosition:temp},{easing:"linear"}).start();
    }
    
    Enemykilled(enemy:Node){
        const enemytype=enemy.getComponent(Enemy);
        console.log(22222);
        // if(enemytype.getblood()<=0){
        //     console.log("回收",enemy);
        //     this.enemyPool.put(enemy);
        // }
    }
}


