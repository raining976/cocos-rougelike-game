import { _decorator, Component, Node ,PhysicsSystem2D,EPhysics2DDrawFlags} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    start() {
    //    this.openDebugInfo()
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

    }
}

