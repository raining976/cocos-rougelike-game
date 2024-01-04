import { _decorator, Component, director, instantiate, macro, Node, Prefab, Vec3, NodePool, nextPow2 } from 'cc';
import { ExpBall } from './ExpBall';
const { ccclass, property } = _decorator;

@ccclass('ExpSpawner')
export class ExpSpawner extends Component {
  @property(Prefab) private expBallPrefabs: Prefab[] = [];
  @property(Node) TargetNode: Node;

  private nodePool: NodePool = new NodePool();

  private curExpBalls: Node[] = []

  start() { }

  private spawnSingleBall(prefabName: string) {
    let prefab = this.expBallPrefabs.find(prefab => prefab.name == prefabName)
    if (this.nodePool.size() > 0) {
      return this.nodePool.get();
    } else
      return instantiate(prefab);
  }

  reclaimNode(node: Node) {
    if (node) {
      this.nodePool.put(node)
    }
  }

  recalaimAllExpBall() {
    this.curExpBalls.forEach(b => {
      this.reclaimNode(b)
    })
  }

  GenerateOneExpBall(currentPosition: Vec3, prefabName: string = 'Small') {
    let NewExpBall = this.spawnSingleBall(prefabName);
    this.curExpBalls.push(NewExpBall)
    NewExpBall.setWorldPosition(currentPosition);
    this.node.addChild(NewExpBall);
    this.autoReclaim(NewExpBall)
  }

  autoReclaim(node: Node, timeout = 60 * 1000) {
    setTimeout(() => {
      this.reclaimNode(node)
    }, timeout);
  }
}

