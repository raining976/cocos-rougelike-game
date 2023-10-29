import { _decorator, Component, Node, Prefab, randomRange,Vec3, instantiate, macro,game, TiledUserNodeData} from 'cc';
import { EnemySettings } from './EnemySettings';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('EnemySpanwner')
export class EnemySpanwner extends Component {
    @property(Prefab) private enemies: Prefab;
    private curDelay:number=0;
    @property(Node) private TargetNode:Node;
    // private TargetNode:Node;
    private IdToSettings=new Map<string,EnemySettings>();
    private SpanwnerDelay:number=1.0;//怪物生成延迟
    private interval:number=1.0;//状态机AI执行间隔
    private AIdelay:number=1.0;//状态机AI执行延迟
    private attackdelay:number=0.1;//伤害判定延迟
    private localpos:Vec3=new Vec3();
    start() {
        console.log("stlocalpos: ",this.localpos);
        this.localpos.x=360;
        this.localpos.y=308.4466019417476;
        console.log("stlocalpos: ",this.localpos);
    }

    update(deltaTime: number) {
        this.curDelay+=deltaTime;
        // console.log("222",randomRange(300, 600)* (Math.random() < 0.5 ? 1 : -1));
        console.log(this.curDelay);
        if(this.curDelay>this.SpanwnerDelay){
            this.curDelay=0;
            const posX: number = randomRange(90, 180) * (Math.random() < 0.5 ? 1 : -1);
            const posY: number = randomRange(300, 600) * (Math.random() < 0.5 ? 1 : -1);
            // console.log(this.curDelay,posX,posY);
             console.log(this.TargetNode.worldPosition);
            const spawnPosition = new Vec3();
            spawnPosition.x = this.TargetNode.worldPosition.x + posX-this.node.worldPosition.x;
            spawnPosition.y = this.TargetNode.worldPosition.y + posY-this.node.worldPosition.y;
            // console.log(this.enemies);
            // console.log("spawnPosition is: ",spawnPosition);
            const enemynode:Node=instantiate(this.enemies);
            enemynode.setWorldPosition(spawnPosition);
            const one_enmey=enemynode.addComponent(Enemy)//敌人配置读取
            console.log("enemynodepos: ",enemynode.worldPosition);
            this.node.addChild(enemynode);
            // console.log("thisnodePosition is: ",this.node.worldPosition);
            // console.log("enemynodePosition is: ",enemynode.worldPosition);
            // console.log(this.node.children[2]);
            this.schedule(this.StateAI.bind(enemynode,this.TargetNode,this.localpos),this.interval,macro.REPEAT_FOREVER,this.AIdelay);
        }
        
    }

    StateAI(targetnode:Node,localpos:Vec3){
        // console.log(this.worldPosition);
        console.log("tnpos is: ",targetnode.worldPosition);
        console.log("thispos is: ",this.worldPosition);
        const enemytype=this.getComponent(Enemy);
        if(targetnode ==null){//目标节点不存在
            return;
        }

        // if(targetnode.curState =="Die"){//玩家已死亡
        //     return;
        // }

        // const canAttack=//攻击间隔判定
        const distance=Vec3.distance(this.worldPosition,targetnode.worldPosition);//攻击间隔判定//不用管报错，VScode这里识别不出bind绑定
        if(distance>enemytype.getattackrange()){
            let temp=new Vec3();
            Vec3.subtract(temp, targetnode.worldPosition, this.worldPosition);
            temp.normalize();
            console.log("temp1= ",temp);
            temp.x=temp.x*10;
            temp.y=temp.y*10;
            temp.z=temp.z*10;
            console.log("temp2= ",temp);
            console.log("pos1:",this.worldPosition);
            Vec3.add(temp,temp,this.worldPosition);
            Vec3.subtract(temp,temp,localpos);
            this.setPosition(temp);
            console.log("pos2:",this.worldPosition);
        }
    }
    
}


