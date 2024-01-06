import { _decorator, Component, Node, Prefab, randomRange, instantiate, macro, game, Sprite, Animation, ProgressBar, tween, AnimationState, Vec3, director, Collider2D, Contact2DType, IPhysics2DContact, BoxCollider2D, Tween, randomRangeInt } from 'cc';
import { EnemyAttr } from './EnemySettings';
import { EnemySpawner } from './EnemySpawner';
import { ExpSpawner } from '../Exp/EnemyDeath/ExpSpawner';
import StateBase from '../utils/FSM/StateBase';
import Animator from '../utils/FSM/Animator';
import { Randompos } from '../utils/Randompos';
import AnimatorManager from '../utils/FSM/AnimatorManager';
import { ProxyClass } from '../utils/FSM/ProxyClass';
import { FloatLabel } from '../FloatLabel/FloatLabel';
import { FloatLabelBase } from '../FloatLabel/FloatLabelBase';
import { ProjectileGenerate } from '../Projectile/ProjectileGenerate';
import { Projectile } from '../Projectile/Projectile';
import { Skill } from '../Skill/Skill';
import { GlobalVariable } from '../Control/GlobalVariable';

const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property(Sprite) protected sprite: Sprite;//敌人的绘图
    @property(Animation) protected MoveAnim: Animation;//敌人的动画
    @property(ProgressBar) bloodProgressBar: ProgressBar;//敌人的血条
    @property(Prefab) floatLabelPrefab: Prefab; // 浮动label的prefab

    protected settings = EnemyAttr;//敌人属性组配置
    protected id: string = "1";
    protected health: number = 100;//血条上限
    protected damage: number = 1;
    protected speed: number = 100;
    protected xpReward: number = 1;
    protected hasremote: boolean = false;//拥有远程攻击形式
    protected projectilerange: number = -1;//远程攻击范围
    protected attackrange: number = -1;//近战攻击范围
    protected Enemyname: string;//敌人名称，用以从配置中提取属性

    EnemyDeathWorldPosition: Vec3 = new Vec3() // 怪物死亡世界坐标

    //状态机AI相关参数
    public interval: number = 0.2;     //状态机AI思考间隔
    public AIdelay: number = 0.5;        //状态机AI思考延迟
    public attackdelay: number = 0.1;  //伤害判定延迟
    protected _state: StateBase | null = null;//状态委托，储存敌人当前状态
    protected _animator: Animator | null = null;//动画机，管理某种敌人的状态

    protected purgerange: number = 1500;//清除距离，超过这个距离的敌人将为了节省性能被直接回收

    //随机坐标生成器
    private randomposGenerators: Randompos;

    public targetnode: Node = new Node();//目标节点
    public distance: number = -1;//与目标节点的距离
    public dir: Vec3 = new Vec3();//指向目标节点的单位向量

    private globalVariable: GlobalVariable;
    start() {
        this.initCollision()//碰撞监听
        // this.initBoss()//注册Boss生成监听

        //随机坐标生成器初始化
        this.randomposGenerators = new Randompos();
        this.randomposGenerators.setRectangleParameter(100, 200, 100, 200);
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
        this._animator = AnimatorManager.instance().getAnimator(this.Enemyname);//通过名称获取对应的FSM，每种敌人都有自己的FSM
        if (this._animator) {//假如FSM存在，则注册FSM中的状态
            for (let data of this.settings[this.Enemyname].States) {//遍历setting获得该种敌人的所有状态，通过代理类ProxyClass动态构建对应状态对象，注册到对应敌人的FSM中
                this._animator.regState(data, new ProxyClass("Enemy_" + data, this, this.node));//不用管报错，代理构建识别不出来
            }
        }
        // this._animator.switchState("Run");//状态初始化为Run,这也是FSM的好处：只需要字符串即可实现状态的切换
        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

        //FSMAI运行
        this.schedule(this.StateAI, this.interval, macro.REPEAT_FOREVER, this.AIdelay);

        this.globalVariable = director.getScene().getChildByName('Canvas').getChildByName('GameRoot').getComponent(GlobalVariable);
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
        this.hasremote = this.settings[Enemyname].remote;
        this.projectilerange = this.settings[Enemyname].projectilerange;
        this.attackrange = this.settings[Enemyname].attackrange;
        this.targetnode = this.node.parent.getComponent(EnemySpawner).gettargetnode();
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
        this.hasremote = this.settings[this.Enemyname].remote;
        this.projectilerange = this.settings[this.Enemyname].projectilerange;
        this.attackrange = this.settings[this.Enemyname].attackrange;
        this.bloodProgressBar.progress = 1;
        this._animator.switchState("Run");
        this.initCollision()//碰撞监听
        this.schedule(this.StateAI, this.interval, macro.REPEAT_FOREVER, this.AIdelay);
    }
    /**
     * FSMAI，以一定间隔进行思考执行动作，只负责状态的切换
     */
    StateAI() {
        this.distance = Vec3.distance(this.node.worldPosition, this.targetnode.worldPosition);//获取距离
        Vec3.subtract(this.dir, this.targetnode.worldPosition, this.node.worldPosition);//获取方向向量
        this.dir.normalize();//归一化方向向量
        this._animator.onUpdate();

        if (this.getblood() <= 0 || this.distance > this.purgerange) {//假如敌人死亡或超出清除距离
            this._animator.switchState("Dead");
            return;
        }

        if (this.distance < this.attackrange) {//目标进入攻击范围则切换至攻击状态，反之切换至运动状态
            this._animator.switchState("Attack");
        } else {
            if (this.distance < this.projectilerange) {//如果进入抛射范围，则进行远程攻击
                this._animator.switchState("Shot");
            } else {
                this._animator.switchState("Run");
            }
        }

    }
    /**
     * 节点回收处理
     * 
     */
    reclaim() {
        this.getComponent(BoxCollider2D).tag = -1;//回收时将tag修改为-1，标志不可用
        // this.CollisionDisable();
        if (this.node && this.node.parent) {
            this.node.parent.getComponent(EnemySpawner).getenemypool().put(this.node);
        };
        return;
    }

    //怪物死亡前调用
    onMonsterDeath() {
        // 将怪物位置信息传递给经验球脚本
        this.EnemyDeathWorldPosition = this.node.getPosition()
        const canvas = director.getScene().getChildByName('Canvas');
        const expSpawner = this.node.parent.getComponent(ExpSpawner);
        let prefabName = this.Enemyname.includes('Boss') ? 'Big' : 'Small';

        let randnum = randomRangeInt(1, 10000);
        prefabName = randnum < 500 ? 'HealthBall' : prefabName;

        expSpawner.GenerateOneExpBall(this.EnemyDeathWorldPosition.clone(), prefabName)

        if (this.Enemyname.includes('Boss')) {
            this.globalVariable.addScore(20);
        } else {
            this.globalVariable.addScore(10);
        }
        this.globalVariable.addKillCount(1);
    }


    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    //监听函数
    /**
     * Boss生成的监听函数注册
     */
    initBoss() {
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
        if (otherCollider.tag == 5 && selfCollider.tag == 1) {

            let reduceBloodValue = otherCollider.node.getComponent(Skill).getDamage()
            let maxHealth = this.gethealth()
            let percent = (reduceBloodValue / maxHealth)
            let curProgress = this.bloodProgressBar.progress
            if (curProgress > 0) {
                let label = instantiate(this.floatLabelPrefab)
                label.getComponent(FloatLabelBase).initLabel('Enemy', reduceBloodValue)
                this.node.addChild(label)
                this.bloodProgressBar.progress -= percent
            }
        }

        // // 中立投射物，对敌我双方都会造成伤害
        // if (otherCollider.tag == 4 && selfCollider.node != otherCollider.node.parent) {
        //     let ProjectileNode = otherCollider.node;
        //     let reduceBloodValue = ProjectileNode.getComponent(Projectile).getProjectiledamage();
        //     let maxHealth = this.gethealth();
        //     let percent = (reduceBloodValue / maxHealth)
        //     let curProgress = this.bloodProgressBar.progress
        //     if (curProgress > 0) {
        //         let label = instantiate(this.floatLabelPrefab)
        //         label.getComponent(FloatLabelBase).initLabel('Enemy', reduceBloodValue)
        //         this.node.addChild(label)
        //         this.bloodProgressBar.progress -= percent
        //     }
        // }
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
    public getprojectilerange() {
        return this.projectilerange;
    }
    public getEnemyname() {
        return this.Enemyname;
    }
    public getstate() {
        return this._state;
    }
    public setblood(bloodProgress: number) {
        this.bloodProgressBar.progress = bloodProgress;
    }
    public setEnemyname(name: string) {
        this.Enemyname = name;
    }
    public setstate(state: StateBase) {
        this._state = state;
    }
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    //补丁
    ProjectileGenerate(pos: Vec3) {
        this.node.getComponent(ProjectileGenerate).Generate(pos);//生成投射物
    }
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
}



