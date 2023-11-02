import { _decorator, Component, Node, Prefab, randomRange,Vec3, instantiate, macro,game, Sprite, Animation} from 'cc';
import { EnemyAttr } from './EnemySettings';
const { ccclass, property } = _decorator;
@ccclass('Enemy')


export class Enemy extends Component {
    
    @property(Sprite) private sprite: Sprite;
    @property(Animation)private MoveAnim:Animation;
    private settings=EnemyAttr;
    private id:string="1";
    private health:number=100;
    private damage:number=1;
    private speed:number=100;
    private xpReward:number=1;
    private attackrange:number=100;
    
    start() {
        const Enemyname:string=this.node.name;
        this.init(Enemyname);
        this.MoveAnim.play();
        // console.log(Enemyname);
        // console.log(this.settings[Enemyname]);
        // console.log(this.node);
        // console.log(Enemyname);
    }
    update(deltaTime: number) {
        // this.MoveAnim.play();
    }
    public init(Enemyname:string):void{
        this.id=this.settings[Enemyname].id;
        this.health=this.settings[Enemyname].health;
        this.damage=this.settings[Enemyname].damage;
        this.speed=this.settings[Enemyname].speed;
        this.xpReward=this.settings[Enemyname].xpReward;
        this.attackrange=this.settings[Enemyname].attackrange;
    }
    public getspeed(){
        return this.speed;
    }
    public getattackrange(){
        return this.attackrange;
    }
}


