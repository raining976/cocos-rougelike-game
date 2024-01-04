import { _decorator, Collider, Collider2D, Component, Contact2DType, geometry, IPhysics2DContact, IPhysics2DImpulse, Node, PhysicsSystem, PhysicsSystem2D, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Wall')
export class Wall extends Component {
    @property(Node) Player: Node
    oponCollider2DEvent() {
        const comp = this.node.getComponent(Collider2D);
        comp.on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => {
            console.log('111')
            // let p = this.Player.getPosition()
            // p.x=0
            // p.y=0
            // this.Player.setPosition(p)
            // console.log(this.Player.getPosition())
        }, this)
    }
    start() {
        this.oponCollider2DEvent()
    }


    update(deltaTime: number) {

    }
}


