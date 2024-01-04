import { _decorator, Collider2D, Component, Contact2DType, Director, director, IPhysics2DContact, log, Node, RigidBody, } from 'cc';
import { ExpSpawner } from '../EnemyDeath/ExpSpawner';
const { ccclass, property } = _decorator;

@ccclass('ExpBallCollision')
export class ExpBallCollision extends Component {


    start() {
        this.initCollision();
    }

    update(deltaTime: number) {


    }
    

    /**
     * on方法注册碰撞事件，或者说是开始监听，以this.onBeginContact作为回调函数
     * @param 
     */
    initCollision(){
        let collider = this.node.getComponent(Collider2D);
        if(collider){
            // 仅注册后开始碰撞
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    /**
     * 开始碰撞以后发生的事情, 碰撞事件发生在物理过程中，此过程无法删除节点
     * @param selfCollider: 碰撞主体
     * @param otherCollider: 碰撞体
     * @param contact: 碰撞相关信息，速度等
     */
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name === 'Player'|| otherCollider.tag == 0 ) {
            //箭头函数
            director.once(Director.EVENT_AFTER_PHYSICS, () =>{
                selfCollider.node.destroy();
                // 拿到这个节点池
                let selfNode = selfCollider.node
                selfNode.parent.getComponent(ExpSpawner).reclaimNode(selfNode)
                // 

            },this)
        }
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
    }
    
}

