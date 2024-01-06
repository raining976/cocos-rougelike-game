import { _decorator, Component, instantiate, Node, NodePool, Prefab, Vec3 } from 'cc';
import { Map } from './Map';
import { Player } from '../Player/Player';
const { ccclass, property } = _decorator;

@ccclass('MapController')
export class MapController extends Component {

    @property(Map) private map: Map;
    @property(Player) private player: Player;
    start() {
        this.map.init(this.player.node);
    }

    update(deltaTime: number): void{
        this.map.gameTick();
    }
}


