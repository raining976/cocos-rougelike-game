import { _decorator, Component, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapGenerator')
export class MapGenerator extends Component {
    @property(Node) Player: Node
    @property(Node) TIledMap000: Node
    @property(Node) TIledMap001: Node
    @property(Node) TIledMap002: Node
    @property(Node) TIledMap003: Node
    @property(Node) TIledMap004: Node
    @property(Node) TIledMap005: Node
    @property(Node) TIledMap006: Node
    @property(Node) TIledMap007: Node
    @property(Node) TIledMap008: Node



    start() {
        // const p = new Vec3
        // console.log(p)
        // console.log(this.TIledMap004.getPosition())
        // const p = new Vec3(2048,2048,0)
        // this.TIledMap004.setPosition(p)
        // console.log(this.TIledMap000.getPosition())
        // console.log(this.TIledMap001.getPosition())
        // console.log(this.TIledMap002.getPosition())
        // console.log(this.TIledMap003.getPosition())
        // console.log(this.TIledMap004.getPosition())
        // console.log(this.TIledMap005.getPosition())
        // console.log(this.TIledMap006.getPosition())
        // console.log(this.TIledMap007.getPosition())
        // console.log(this.TIledMap008.getPosition())
        
    }

    updateMap(playerLocation: Vec3): void {

    }

    update(deltaTime: number) {
        const MapCenter = new Vec3
        this.Player.getPosition(MapCenter)
        const playerLocation = new Vec3
        this.Player.getPosition(playerLocation)
        // console.log(playerLocation)
        this.updateMap(playerLocation)
        // updateMap(this.Player)


    }
}


