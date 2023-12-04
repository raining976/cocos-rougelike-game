import { _decorator, Component, Node, Vec3, macro, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Projectile')
export class Projectile extends Component {
    protected Projectilespeed:number=5//投射物速度
    protected Projectilelife:number=10//投射物生存时间
    start() {
        this.initCollision();//启动碰撞监听
        this.schedule(this.fly,0,macro.REPEAT_FOREVER);
        setTimeout(() => {
            this.unschedule(this.fly);
            this.node.parent.getComponent("ProjectileGenerate").ProjectilePool.put(this.node);
        }, this.Projectilelife*1000);
    }
    /**
     * 投射物的飞行
     */
     fly(){
        const Projectilenode=this.node;//该投射物所处的节点
        const dir=this.node.parent.getComponent("ProjectileGenerate").dir;
        Projectilenode.setWorldPosition(Projectilenode.worldPosition.x+dir.x*this.Projectilespeed,Projectilenode.worldPosition.y+dir.y*this.Projectilespeed,Projectilenode.worldPosition.z);
        
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

    }
}


