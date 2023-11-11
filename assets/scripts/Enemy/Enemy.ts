import { _decorator, Component, Node, Prefab, randomRange,Vec3, instantiate, macro,game, Sprite, Animation, ProgressBar, tween} from 'cc';
import { EnemyAttr } from './EnemySettings';
const { ccclass, property } = _decorator;
@ccclass('Enemy')


export class Enemy extends Component {
    
    @property(Sprite) private sprite: Sprite;//敌人的绘图
    @property(Animation)private MoveAnim:Animation;//敌人的动画
    @property(ProgressBar)private bloodProgressBar:ProgressBar;//敌人的血条
    private settings=EnemyAttr;//敌人属性组配置
    private id:string="1";
    private health:number=100;//血条上限
    private damage:number=1;
    private speed:number=100;
    private xpReward:number=1;
    private attackrange:number=100;//伤害判定范围
    private Enemyname:string;//敌人名称，用以从配置中提取属性

    //状态机AI相关参数
    private interval:number=0.1;//状态机AI思考间隔
    private AIdelay:number=0;//状态机AI思考延迟
    private attackdelay:number=0.1;//伤害判定延迟

    start() {
        this.Enemyname=this.node.name;
        this.init(this.Enemyname);//初始化
        this.MoveAnim.play();
        this.schedule(this.StateAI,this.interval,macro.REPEAT_FOREVER,this.AIdelay);
        
    }
    update(deltaTime: number) {
        let bloodProgress:number=this.bloodProgressBar.progress;
        if(bloodProgress>0){
            bloodProgress-=(deltaTime/10);
            this.bloodProgressBar.progress=bloodProgress;
        }
        
        // console.log(bloodProgress);
        // this.MoveAnim.play();
    }
    public init(Enemyname:string):void{
        this.id=this.settings[Enemyname].id;
        this.health=this.settings[Enemyname].health;
        this.damage=this.settings[Enemyname].damage;
        this.speed=this.settings[Enemyname].speed;
        this.xpReward=this.settings[Enemyname].xpReward;
        this.attackrange=this.settings[Enemyname].attackrange;
    }
    public reset(){
        this.id=this.settings[this.Enemyname].id;
        this.health=this.settings[this.Enemyname].health;
        this.damage=this.settings[this.Enemyname].damage;
        this.speed=this.settings[this.Enemyname].speed;
        this.xpReward=this.settings[this.Enemyname].xpReward;
        this.attackrange=this.settings[this.Enemyname].attackrange;
        this.bloodProgressBar.progress=1;
        this.schedule(this.StateAI,this.interval,macro.REPEAT_FOREVER,this.AIdelay);
    }
    public getspeed(){
        return this.speed;
    }
    public getattackrange(){
        return this.attackrange;
    }
    public getblood(){
        return this.bloodProgressBar.progress;
    }
    //状态机AI，以一定间隔进行思考执行动作
    StateAI(){
        const targetnode:Node=this.node.parent.getComponent("EnemySpanwner").TargetNode;
        // console.log(targetnode);
        const enemytype=this.getComponent(Enemy);
        // console.log("111,",enemytype);
        const blood=enemytype.getblood();
        // console.log("this is: ",enemytype.getspeed());
        // console.log(enemytype.getblood());当前对象血量
        // console.log(this.parent.getComponent("EnemySpanwner").enemyPool);对象池
        if(blood<=0){
            console.log("222",this.node.parent.getComponent("EnemySpanwner").enemyPool);
            this.unschedule(this.StateAI);
            this.node.parent.getComponent("EnemySpanwner").enemyPool.put(this.node);
            // this.parent.getComponent("EnemySpanwner").diednodeid=this.uuid;
            // this.parent.getComponent("EnemySpanwner").unschedule(this.parent.getComponent("EnemySpanwner").StateAI(this.parent.TargetNode));
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

        const distance=Vec3.distance(this.node.worldPosition,targetnode.worldPosition);//攻击间隔判定//不用管报错，VScode这里识别不出bind绑定
        const time=distance/enemytype.getspeed();
        let temp=new Vec3();
            Vec3.subtract(temp, targetnode.worldPosition, this.node.worldPosition);
            temp.normalize();//归一化方向向量
            // console.log("temp1= ",temp);
            Vec3.multiplyScalar(temp,temp,enemytype.getattackrange());
            // console.log("temp2= ",temp);
        Vec3.subtract(temp,targetnode.worldPosition,temp);
            tween(this.node).to(time,{worldPosition:temp},{easing:"linear"}).start();
    }
}


