import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    @property(Node) EnemyBaseNode: Node; // 怪物生成与挂载的节点
    start() {

    }

    update(deltaTime: number) {
        
    }
}


