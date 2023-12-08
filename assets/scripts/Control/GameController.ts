import { _decorator, Component, Node ,PhysicsSystem2D,EPhysics2DDrawFlags, UIOpacity} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    start() {
       this.openDebugInfo()
       this.node.getChildByName("EnhanceRoot").getComponent(UIOpacity).opacity = 0;
    }

    // 打开碰撞体调试信息
    openDebugInfo(){
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        EPhysics2DDrawFlags.Pair |
        EPhysics2DDrawFlags.CenterOfMass |
        EPhysics2DDrawFlags.Joint |
        EPhysics2DDrawFlags.Shape;
    }
    update(deltaTime: number) {
        //this.node.setSiblingIndex(1000);
    }
}

