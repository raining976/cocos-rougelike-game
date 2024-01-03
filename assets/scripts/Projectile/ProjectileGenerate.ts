import { _decorator, Component, Node, Prefab, instantiate, NodePool, Vec3, tween, Collider2D, Contact2DType, IPhysics2DContact, macro, director, BoxCollider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProjectileGenerate')
export class ProjectileGenerate extends Component {
    @property(Prefab) private Projectile: Prefab;//投射物

    //对象池相关参数
    private ProjectilePool: NodePool;//敌人对象池，用于存储和复用敌人节点对象，节省性能开销
    private InitCount:number=10;//对象池容量

    public dir:Vec3=new Vec3();
    start() {
        //对象池初始化
        this.ProjectilePool=new NodePool();
        for(let i=0;i<this.InitCount;i++){
            let Projectilenode=instantiate(this.Projectile);
            this.ProjectilePool.put(Projectilenode);
        }
    }
    /**
     * 投射物的生成
    */
    Generate(targetpos:Vec3){
        Vec3.subtract(this.dir, targetpos, this.node.worldPosition);
        this.dir.normalize();//归一化方向向量
        let Projectilenode=null;
        if(this.ProjectilePool.size()>0){//若对象池有存对象，则取出
            Projectilenode=this.ProjectilePool.get();
        }
        else{//否则实例化一个
            Projectilenode=instantiate(this.Projectile);
        }
        this.node.addChild(Projectilenode);
        Projectilenode.setWorldPosition(this.node.worldPosition);
        Projectilenode.angle=Math.acos(this.dir.x)*180/Math.PI;
        if(this.dir.y<0){
            Projectilenode.angle=-Projectilenode.angle;
        }
        if(Projectilenode.used==true){
            Projectilenode.reset();
        }
        setTimeout(() => {
            Projectilenode.getComponent(BoxCollider2D).tag=4;
        }, 1000);//延时激活碰撞体
    }
    getProjectilePool(){
        return this.ProjectilePool;
    }
}


