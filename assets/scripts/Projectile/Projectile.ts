import { _decorator, Component, Node, Vec3, macro, Contact2DType, Collider2D, IPhysics2DContact, instantiate, BoxCollider2D, tween, Tween } from 'cc';

import { FloatLabel } from '../FloatLabel/FloatLabel';
import { FloatLabelBase } from '../FloatLabel/FloatLabelBase';
import { ProjectileGenerate } from './ProjectileGenerate';
const { ccclass, property } = _decorator;

@ccclass('Projectile')
export class Projectile extends Component {
    protected Projectilespeed:number=1//投射物速度
    protected Projectilelife:number=20//投射物生存时间
    protected Projectiledamage:number=20//投射物伤害
    public dir:Vec3=new Vec3();
    public pos:Vec3=new Vec3();
    public used:boolean=false;
    start() {
        this.dir.x=this.node.parent.getComponent(ProjectileGenerate).dir.x;
        this.dir.y=this.node.parent.getComponent(ProjectileGenerate).dir.y;
        this.dir.z=this.node.parent.getComponent(ProjectileGenerate).dir.z;//值传递
        // this.dir=Object.assign({},this.node.parent.getComponent(ProjectileGenerate).dir);//只能创造浅拷贝...
        // this.dir.multiplyScalar(this.Projectilespeed);
        // this.pos=this.dir.add(this.node.worldPosition);
        
        this.initCollision();//启动碰撞监听
        this.schedule(this.fly,0,macro.REPEAT_FOREVER,1);
        // tween(this.node).to(this.Projectilelife, { worldPosition: this.pos }, { easing: "linear" }).start();
        this.autoReclaim();
    }

    reset(){
        this.dir.x=this.node.parent.getComponent(ProjectileGenerate).dir.x;
        this.dir.y=this.node.parent.getComponent(ProjectileGenerate).dir.y;
        this.dir.z=this.node.parent.getComponent(ProjectileGenerate).dir.z;//值传递
        this.schedule(this.fly,0,macro.REPEAT_FOREVER);
    }
    autoReclaim(){
        setTimeout(() => {
            this.reclaim()
        }, this.Projectilelife*1000);
    }

    reclaim(){
        this.getComponent(BoxCollider2D).tag=-1;//回收时将tag修改为-1，标志不可用
        if(this.node.parent){
            this.unschedule(this.fly);
            this.used=true;
            this.node.parent.getComponent(ProjectileGenerate).getProjectilePool().put(this.node);
        }
    }

    /**
     * 投射物的飞行
     */
     fly(){
        const P=this.node;//该投射物所处的节点
        P.setWorldPosition(
            this.node.worldPosition.x+this.dir.x*this.Projectilespeed,
            this.node.worldPosition.y+this.dir.y*this.Projectilespeed,
            this.node.worldPosition.z);
        this.node.position=P.position
        
    }
    /**
     * 投射物碰撞的监听函数注册
     */
     initCollision() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            // 仅注册后开始碰撞
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if((otherCollider.tag==0||otherCollider.tag==1)&&otherCollider.node!=this.node.parent){
            setTimeout(() => {
                this.reclaim();
            }, 0.01);//cocos引擎存在的问题，碰撞之后节点立刻销毁会出现报错，必须延时
        }
    }
    getProjectiledamage(){
        return this.Projectiledamage;
    }
}


