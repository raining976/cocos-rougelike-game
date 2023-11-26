import { _decorator, Component, director, instantiate, macro, Node, Prefab, Vec3 } from 'cc';
import { ExpBall } from './ExpBall';
const { ccclass, property } = _decorator;

@ccclass('ExpSpawner')
export class ExpSpawner extends Component {
    @property(Prefab) private ExpBallPrefab: Prefab;
    @property(Node) TargetNode: Node;
    
    start() {

    }

    update(deltaTime: number) {
        
    }

    handleMonsterDeath(monsterPosition: Vec3) {
        // 在这里处理怪物死亡后的逻辑，使用怪物位置信息（monsterPosition）
        this.GenerateOneExpBall(monsterPosition)
      }
    GenerateOneExpBall(currentPosition: Vec3){
        //经验球生成
        let NewExpBall = instantiate(this.ExpBallPrefab); // 生成预制体实例
    
        NewExpBall.setWorldPosition(currentPosition);

        this.node.addChild(NewExpBall);

   }
}

