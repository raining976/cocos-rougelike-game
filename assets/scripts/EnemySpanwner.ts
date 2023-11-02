import { _decorator, Component, Node, Prefab, randomRange,Vec3, instantiate, macro,game, TiledUserNodeData, tween, Tween, randomRangeInt} from 'cc';
import { EnemySettings } from './EnemySettings';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('EnemySpanwner')
export class EnemySpanwner extends Component {
    @property(Prefab) private enemies: Prefab[]=[];
    private curDelay:number=0;//生成器计时
    @property(Node) private TargetNode:Node;
    // private TargetNode:Node;
    // private IdToSettings=new Map<string,EnemySettings>();
    private SpanwnerDelay:number=1;//怪物生成延迟
    private interval:number=0.1;//状态机AI思考间隔
    private AIdelay:number=0;//状态机AI思考延迟
    private attackdelay:number=0.1;//伤害判定延迟
    private localpos:Vec3=new Vec3();
    start() {
        this.localpos.x=this.node.worldPosition.x;
        this.localpos.y=this.node.worldPosition.y;
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
            const enemynode:Node=instantiate(this.enemies[randomRangeInt(0, this.enemies.length)]);
            enemynode.setWorldPosition(spawnPosition);
            // const one_enmey=enemynode.addComponent(Enemy)//敌人配置读取
            this.node.addChild(enemynode);
            this.schedule(this.StateAI.bind(enemynode,this.TargetNode,this.localpos),this.interval,macro.REPEAT_FOREVER,this.AIdelay);
        }
        
    }

    StateAI(targetnode:Node,localpos:Vec3){
        const enemytype=this.getComponent(Enemy);
        console.log("this is: ",enemytype.getspeed());
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
    
}


