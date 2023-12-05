import { _decorator, Component, Node, Prefab, randomRange, instantiate, macro, game, Sprite, Animation, ProgressBar, tween, AnimationState, Vec3, director, Collider2D, Contact2DType, IPhysics2DContact, BoxCollider2D, Tween } from 'cc';
import { EnemyAttr } from './EnemySettings';
import { ExpSpawner } from '../Exp/EnemyDeath/ExpSpawner';
import { Weapon } from '../Weapon/Weapon';
import StateBase from '../utils/FSM/StateBase';
import Animator from '../utils/FSM/Animator';
import { Randompos } from '../utils/Randompos';
import AnimatorManager from '../utils/FSM/AnimatorManager';
import { ProxyClass } from '../utils/FSM/ProxyClass';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property(Sprite) protected sprite: Sprite;//敌人的绘图
    @property(Animation) protected MoveAnim: Animation;//敌人的动画
    @property(ProgressBar) bloodProgressBar: ProgressBar;//敌人的血条

    protected settings = EnemyAttr;//敌人属性组配置
    protected id: string = "1";
    protected health: number = 100;//血条上限
    protected damage: number = 1;
    protected speed: number = 100;
    protected xpReward: number = 1;
    protected attackrange: number = 100;//伤害判定范围
    protected Enemyname: string;//敌人名称，用以从配置中提取属性

    protected isBoss: boolean = false

    EnemyDeathWorldPosition: Vec3 = new Vec3() // 怪物死亡世界坐标

    //状态机AI相关参数
    public interval: number = 0.2;     //状态机AI思考间隔
    public AIdelay: number = 0.5;        //状态机AI思考延迟
    public attackdelay: number = 0.1;  //伤害判定延迟
    protected _state: StateBase | null = null;//状态委托，储存敌人当前状态
    protected _animator: Animator | null = null;//动画机，管理某种敌人的状态

    //随机坐标生成器
    private randomposGenerators:Randompos;

    start() {
        //监听函数注册
        this.initBoss()//注册Boss生成监听
        this.initCollision()//碰撞监听

        //随机坐标生成器初始化
        this.randomposGenerators=new Randompos();
        this.randomposGenerators.setRectangleParameter(100,200,100,200);
        this.randomposGenerators.setCircleParameter(800);

        //敌人初始化
        this.Enemyname = this.node.name;
        this.init(this.Enemyname);//初始化
        this.MoveAnim.play();
        
        /*说实话，这一段现在放在这里并不太好，因为这样每生成一个敌人就会重复一次动画机的注册，
        就会new一批状态对象，而我们全局只需要注册一次。
        所以最好有一个全局管理的脚本，然后在那里注册状态*/

        /*状态机的动态注册是最好要保留的，不要想着用静态注册来代替，
        这样我们在调整角色状态的时候，只需要改变setting中的state字段，
        而不需要对多个文件进行修改，有利于代码的解耦合
        */

        /*Enemy_%是状态类名，%是状态名，状态名是在用户处自定义的，不要搞混了*/

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        //FSM注册
        // console.log(111,"Enemy_"+this.settings[this.Enemyname].States[0]);
        // let aClss=new ProxyClass('AClass');
        this._animator=AnimatorManager.instance().getAnimator(this.Enemyname);//通过名称获取对应的FSM，每种敌人都有自己的FSM
        if(this._animator){//假如FSM存在，则注册FSM中的状态
            for(let data of this.settings[this.Enemyname].States){//遍历setting获得该种敌人的所有状态，通过代理类ProxyClass动态构建对应状态对象，注册到对应敌人的FSM中
                this._animator.regState(data,new ProxyClass("Enemy_"+data,this,this.node));//不用管报错，代理构建识别不出来
            }
        }
        // this._animator.switchState("Run");//状态初始化为Run,这也是FSM的好处：只需要字符串即可实现状态的切换
        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

        //FSMAI运行
        this.schedule(this.StateAI, this.interval, macro.REPEAT_FOREVER, this.AIdelay);
    }
    
    /**
     * 敌人节点初始化函数
     * @param Enemyname ：敌人名称，用来提取配置
     */
    public init(Enemyname: string): void {
        this.id = this.settings[Enemyname].id;
        this.health = this.settings[Enemyname].health;
        this.damage = this.settings[Enemyname].damage;
        this.speed = this.settings[Enemyname].speed;
        this.xpReward = this.settings[Enemyname].xpReward;
        this.attackrange = this.settings[Enemyname].attackrange;
    }
    /**
     * 敌人节点复位函数
     */
    public reset() {
        this.id = this.settings[this.Enemyname].id;
        this.health = this.settings[this.Enemyname].health;
        this.damage = this.settings[this.Enemyname].damage;
        this.speed = this.settings[this.Enemyname].speed;
        this.xpReward = this.settings[this.Enemyname].xpReward;
        this.attackrange = this.settings[this.Enemyname].attackrange;
        this.bloodProgressBar.progress = 1;
        this.initCollision()//碰撞监听
        this._animator.switchState("Run");
        this.schedule(this.StateAI, this.interval, macro.REPEAT_FOREVER, this.AIdelay);
    }
    /**
     * FSMAI，以一定间隔进行思考执行动作，只负责状态的切换
     */
     StateAI() {
        const targetnode: Node = this.node.parent.getComponent("EnemySpawner").TargetNode;
        const distance = Vec3.distance(this.node.worldPosition, targetnode.worldPosition);
        this._animator.onUpdate();

        if (this.getblood() <= 0) {//假如敌人死亡
            this._animator.switchState("Dead");
            return;
        }

        if (targetnode == null) {//假如目标节点不存在
            return;
        }

        if(distance<this.attackrange){//目标进入攻击范围则切换至攻击状态，反之切换至运动状态
            this._animator.switchState("Attack");
        }else{
            this._animator.switchState("Run");
        }
        
    }
    /**
     * 节点回收处理
     * 
     */
    reclaim() {
        this.node.setWorldPosition(this.randomposGenerators.CircularSpawner(this.node.parent.getComponent("EnemySpawner").TargetNode.worldPosition));
        this.CollisionDisable();
        setTimeout(() => {
            if(this.node.parent){
                this.node.parent.getComponent("EnemySpawner").enemyPool.put(this.node);
            }
        }, 300);//没有延时的话，放入对象池会导致setposition的中断
        return;
    }

    //怪物死亡前调用
    onMonsterDeath() {
        // 将怪物位置信息传递给经验球脚本
        this.EnemyDeathWorldPosition = this.node.getPosition()
        const canvas = director.getScene().getChildByName('Canvas');
        const expSpawner = canvas.getComponent(ExpSpawner);
        let prefabName = this.Enemyname.includes('Boss') ? 'Big' : 'Small';
        expSpawner.GenerateOneExpBall(this.EnemyDeathWorldPosition, prefabName)
    }
    

    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    //监听函数
    /**
     * Boss生成的监听函数注册
     */
    initBoss(){
        this.node.parent.on('Boss', (event) => {
            this.bloodProgressBar.progress = 0;
        })
    }
    /**
     * 怪物碰撞的监听函数注册
     */
    initCollision() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            // 仅注册后开始碰撞
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    /**
     * 怪物碰撞监听关闭
     */
    CollisionDisable() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {


        //碰撞体注意事项:
        // 1: 两者至少一个kinematic
        // 2: 两者不能是同一个分组，也不能是同一个Default

        //这里将武器的Tag设置成5就会撞击了
        if (otherCollider.tag == 5) {
            //这两句不能放在外面，要不然如果碰到的是经验球就会报错
            let reduceBloodValue = otherCollider.node.getComponent(Weapon).getDamage()
            let maxHealth = this.gethealth()
            let percent = (reduceBloodValue / maxHealth)
            let curProgress = this.bloodProgressBar.progress
            curProgress > 0 && (this.bloodProgressBar.progress -= percent)
        }
    }


    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    //Enemy属性获取接口
    public getanim() {
        return this.MoveAnim;
    }
    public getblood() {
        return this.bloodProgressBar.progress;
    }
    public getid() {
        return this.id;
    }
    public gethealth() {
        return this.health;
    }
    public getdamage() {
        return this.damage;
    }
    public getspeed() {
        return this.speed;
    }
    public getxpReward() {
        return this.xpReward;
    }
    public getattackrange() {
        return this.attackrange;
    }
    public getEnemyname() {
        return this.Enemyname;
    }
    public setblood(bloodProgress: number) {
        this.bloodProgressBar.progress = bloodProgress;
    }
    public setEnemyname(name: string) {
        this.Enemyname = name;
    }
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    //补丁
    /**
     * 这就一个纯补丁，以后得想个办法移走
     */
    patch(){
        this.bloodProgressBar.progress = 1;
    }
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
}



