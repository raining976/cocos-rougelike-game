import { _decorator, Component, Node, Prefab, randomRange,Vec3, instantiate, macro,game} from 'cc';
const { ccclass, property } = _decorator;
@ccclass('Enemy')
export class Enemy extends Component {
    private id:string="1";
    private graphType:string="";
    private health:number=100;
    private damage:number=1;
    private speed:number=10;
    private xpReward:number=1;
    private attackrange:number=1;
    public init(/*pos:Vec3,settings:EnemySettings*/):Enemy{
        // this.id=settings.id;
        // this.graphType=settings.graphType;
        // this.health=settings.health;
        // this.damage=settings.damage;
        // this.speed=settings.speed;
        // this.xpReward=settings.xpReward;

        // this.node.setWorldPosition(pos);
        // this.node.active=true;
        return this;
    }
    public getattackrange(){
        return this.attackrange;
    }
}


