import { _decorator, Component, director, instantiate, macro, Node, Prefab, Vec3 } from 'cc';
import { ExpBall } from './ExpBall';
const { ccclass, property } = _decorator;

@ccclass('ExpSpawner')
export class ExpSpawner extends Component {
    @property(Prefab) private ExpBallPrefab: Prefab;
    @property(Node) TargetNode: Node;
    
    start() {
        let currentPosition = new Vec3(this.TargetNode.position);
        this.schedule(this.GenerateOneExpBall(currentPosition), 0.5, macro.REPEAT_FOREVER);
        //let currentPosition = new Vec3(500, 500 ,10);
        //this.GenerateOneExpBall(currentPosition);
        //console.log(this.node.position)
        //this.GenerateOneExpBall(this.node.position)
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
        console.log('NewExpBall',NewExpBall)
        //currentPosition.z = 0;
      //  NewExpBall.setWorldPosition(currentPosition);
       // console.log(NewExpBall)
       // this.node.addChild(NewExpBall);
        //this.node.parent.addChild(NewExpBall);
   }
}

