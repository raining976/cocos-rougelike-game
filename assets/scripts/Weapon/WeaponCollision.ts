import { _decorator, Canvas, Collider2D, Component, Contact2DType, Director, director, IPhysics2DContact, Node, Prefab } from 'cc';
import { Enemy } from '../Enemy/Enemy';
const { ccclass, property } = _decorator;

@ccclass('WeaponCollision')
export class WeaponCollision extends Component {
    
    start() {
        this.initCollision();
        console.log("开始加载武器");
    }

    update(deltaTime: number) {
        
    }
    

    //这里的碰撞和Exp的碰撞类似
    
    initCollision(){
        let collider = this.getComponent(Collider2D);
        if(collider){
            // 仅注册后开始碰撞
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        //血条是脚本里面实现的属性，目标是获得Enemy脚本，而不是节点。
        //碰撞组件->敌人预制体->敌人脚本

        console.log("敌人碰撞开始");
        if (otherCollider.tag === 1 ){
            //这两句不能放在外面，要不然如果碰到的是经验球就会报错
            let enemy = otherCollider.getComponent(Enemy);
            let bloodProgress:number = enemy.bloodProgressBar.progress;
            if(bloodProgress > 0){
                bloodProgress -= 0.1;
                enemy.bloodProgressBar.progress=bloodProgress;
             }
        }
        // if (otherCollider.tag == 1 ) {
        //     if(blood > 0){
        //         enemy.bloodProgressBar.progress -= 1;
        //     }
            
        // }
    }


    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){

    }


    
}

