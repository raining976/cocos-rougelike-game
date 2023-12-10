import { _decorator, Component, director, instantiate, macro, Node, Prefab, Vec3 } from 'cc';
import { ExpBall } from './ExpBall';
const { ccclass, property } = _decorator;

@ccclass('ExpSpawner')
export class ExpSpawner extends Component {
  @property(Prefab) private expBallPrefabs: Prefab[] = [];
  @property(Node) TargetNode: Node;

  start() {

  }

  update(deltaTime: number) {

  }

 
  GenerateOneExpBall(currentPosition: Vec3, prefabName: string = 'Small') {
    let prefab = this.expBallPrefabs.find(prefab => prefab.name == prefabName)
    let NewExpBall = instantiate(prefab);
    NewExpBall.setWorldPosition(currentPosition);
    this.node.addChild(NewExpBall);

  }
}

