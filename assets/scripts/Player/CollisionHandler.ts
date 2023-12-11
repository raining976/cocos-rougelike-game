import { _decorator, Component, Node ,Collider2D,Contact2DType,director, Prefab, IPhysics2DContact, instantiate} from 'cc';
const { ccclass, property } = _decorator;
import { ExpBall } from '../Exp/EnemyDeath/ExpBall';
import { Player } from './Player';
import{Enemy} from '../Enemy/Enemy';
import { AttrController } from './Controllers/AttrController';
import { ProjectileGenerate } from '../Projectile/ProjectileGenerate';
import { Projectile } from '../Projectile/Projectile';
/*
tag:
-1:不可用对象
0：玩家
1：小怪
2：经验球
3：更改武器
4：中立投射物
5：武器
*/

@ccclass('CollisionHandler')
export class CollisionHandler extends Component {
  
    attrController: AttrController = null // 属性控制器
    start() {
        this.attrController = this.node.getComponent(AttrController)
    }   

    onLoad() {
        this.initCollider();
    }

    onDestroy() {
        this.destroyCollider();
    }

    initCollider() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    destroyCollider() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollier: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 小怪
        if (otherCollider.tag == 1) {
            let enemyNode = otherCollider.node
            this.attrController.reduceHealth(enemyNode.getComponent(Enemy).getdamage());
        }

        // 经验球
        if (otherCollider.tag == 2) {
            //TODO: 先默认传 1 后面传经验球表示的经验大小
            let delta = otherCollider.node.getComponent(ExpBall).getValue()
            this.attrController.increaseExp(delta)
        }
        // tag == 3 更改武器
        if (otherCollider.tag == 3) {
            // TODO: 
            // 1. 将这个武器名称更新到人物
            // 2. 调用WeaponSpawnner.changeWeapon()
        }
        // 中立投射物，对敌我双方都会造成伤害
        if (otherCollider.tag == 4) {
            let ProjectileNode = otherCollider.node
            this.attrController.reduceHealth(ProjectileNode.getComponent(Projectile).getProjectiledamage());
        }
    }
   
}

