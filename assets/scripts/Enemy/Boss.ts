import { _decorator, Component, Node, Prefab, randomRange,Vec3, instantiate, macro,game, Sprite, Animation, ProgressBar, tween,Event} from 'cc';
import { EnemyAttr } from './EnemySettings';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('Boss')
export class Boss extends Enemy {
    //动画相关参数
    protected inrange=false;//是否进入攻击范围
    start() {
        this.node.dispatchEvent(new Event('Boss'));
        this.Enemyname=this.node.name;
        this.init(this.Enemyname);//初始化
        this.MoveAnim.play("run");
        this.schedule(this.StateAI,this.interval,macro.REPEAT_FOREVER,this.AIdelay);
        this.schedule(this.Statecheck,this.interval,macro.REPEAT_FOREVER,this.AIdelay)
    }
    update(deltaTime: number) {
        let bloodProgress:number=this.getblood();
        if(bloodProgress>0){
            bloodProgress-=(deltaTime/10);
            this.bloodProgressBar.progress=bloodProgress;
        }
        
    }
    reclaim(){
        this.unschedule(this.StateAI);
        this.node.destroy();
        this.node.parent.emit('Bossdied');
        return;
    }
    /**
     * 动画状态切换
     */
    Statecheck(){
        let temp=(Vec3.distance(this.node.worldPosition,this.node.parent.getComponent("EnemySpanwner").TargetNode.worldPosition)-this.attackrange<=20);
        if(temp&&!this.inrange){
            this.MoveAnim.stop();
            this.MoveAnim.play("attack");
            this.inrange=true;
        }
        else if(!temp&&this.inrange){
            this.MoveAnim.stop();
            this.MoveAnim.play("run");
            this.inrange=false;
        }
    }
}

