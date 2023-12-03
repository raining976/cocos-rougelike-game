import { _decorator, Component, Node } from 'cc';
import { Player } from '../Player';
const { ccclass, property } = _decorator;

@ccclass('AttributeController')
export class AttributeController extends Component {
    private player;
    /**
     * 提升角色生命值
     */
    improveMaxHealth() {
        this.player.setMaxHealth(this.player.getMaxHealth() * 2);
        //TODO:调整属性平衡
    }

    /**
     * 提升角色攻击力
     */
    improveDamage() {
        this.player.setDamage(this.player.getDamage() * 2);
        //TODO:调整属性平衡
    }

    improveSpeed() {
        this.player.setSpeed(this.player.getSpeed() * 2);
        //TODO:调整属性平衡
    }
    start() {
        this.player = this.node.getComponent(Player);
    }

    update(deltaTime: number) {
        
    }
}


