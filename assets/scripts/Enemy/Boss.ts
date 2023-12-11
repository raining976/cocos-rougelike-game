import { _decorator, Component, Node, Prefab, randomRange,Vec3, instantiate, macro,game, Sprite, Animation, ProgressBar, tween,Event, BoxCollider2D} from 'cc';
import { EnemyAttr } from './EnemySettings';
import { Enemy } from './Enemy';
import AnimatorManager from '../utils/FSM/AnimatorManager';
import { ProxyClass } from '../utils/FSM/ProxyClass';
import { EnemySpawner } from './EnemySpawner';
const { ccclass, property } = _decorator;

@ccclass('Boss')
export class Boss extends Enemy {
    //动画相关参数
    protected inrange=false;//是否进入攻击范围
    start() {
        this.initCollision()//碰撞监听
        this.Enemyname=this.node.name;
        this.init(this.Enemyname);//初始化
        this.MoveAnim.play("run");
        //FSM注册
        this._animator=AnimatorManager.instance().getAnimator(this.Enemyname);//通过名称获取对应的FSM，每种敌人都有自己的FSM
        if(this._animator){//假如FSM存在，则注册FSM中的状态
            for(let data of this.settings[this.Enemyname].States){//遍历setting获得该种敌人的所有状态，通过代理类ProxyClass动态构建对应状态对象，注册到对应敌人的FSM中
                this._animator.regState(data,new ProxyClass("Enemy_"+data,this,this.node));//不用管报错，代理构建识别不出来
            }
        }
        setTimeout(() => {
            this.node.getComponent(BoxCollider2D).tag=1;
        }, 100);//延时激活碰撞体
        this.schedule(this.StateAI,this.interval,macro.REPEAT_FOREVER,this.AIdelay);
        this.schedule(this.Statecheck,this.interval,macro.REPEAT_FOREVER,this.AIdelay)
    }
    reclaim(){
        this.getComponent(BoxCollider2D).tag=-1;//回收时将tag修改为-1，标志不可用
        this.unschedule(this.StateAI);
        this.node.destroy();
        this.node.parent.emit('Bossdied');
        return;
    }
    /**
     * 动画状态切换
     */
    Statecheck(){
        let temp=(Vec3.distance(this.node.worldPosition,this.node.parent.getComponent(EnemySpawner).gettargetnode().worldPosition)-this.attackrange<=20);
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

