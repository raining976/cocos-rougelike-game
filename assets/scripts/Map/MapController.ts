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
    // /** 地图预制体数组 */
    // @property(Prefab) maps: Prefab[] = []!
    // @property(Node) playerBaseNode: Node
    // @property(Node) mapContainer: Node
    // nodePools: NodePool[]

    // // 3x3
    // /**
    //  *   0 1 2 
    //  *   0 1 2
    //  *   0 1 2
    //  */
    // curMaps: Node[][]
    // rowNodes: Node[]

    // deltaPos: Vec3 = new Vec3(100, 100, 0)

    // start() {
    //     const len = this.maps.length
    //     for (let i = 0; i < len; i++) {
    //         this.nodePools.push(new NodePool())
    //     }
    //     this._initMaps
    // }

    // /**
    //  * 
    //  * @param num 初始化地图数量
    //  */
    // _initMaps(num: number = 9) {
    //     for (let i = 0; i < num; i++) {
    //         // this.curMaps.push(this.spawnNode(0))
    //     }
        
    // }

    // // updateMapNodes(flag: number = 0) {
       
    // // }

    // /**
    //  * @description 构建地图
    //  */
    // generateMap() {
    //     const centerMapPos = this.curMaps[1][1].worldPosition
    //     const delPos = this.playerBaseNode.worldPosition.subtract(centerMapPos)
    //     const x = delPos.x
    //     const y = delPos.y
    //     const mapHalfSize = 1000
    //     if (x > mapHalfSize) {
    //         // 正在向右走
    //         // 先生成三个 
    //         this.curMaps[0].push(this.spawnNode(0))
    //         this.curMaps[1].push(this.spawnNode(0))
    //         this.curMaps[2].push(this.spawnNode(0))
    //         this.curMaps[0][3].setWorldPosition(this.curMaps[0][2].worldPosition.add(this.deltaPos))
    //         this.curMaps[1][3].setWorldPosition(this.curMaps[1][2].worldPosition.add(this.deltaPos))
    //         this.curMaps[2][3].setWorldPosition(this.curMaps[2][2].worldPosition.add(this.deltaPos))
    //         this.mapContainer.addChild(this.curMaps[0][3])
    //         this.mapContainer.addChild(this.curMaps[1][3])
    //         this.mapContainer.addChild(this.curMaps[2][3])

    //         let temp = this.curMaps[0].shift()
    //         this.reclaimNode(temp)
    //     } else if (x < -mapHalfSize) {
    //         // left
    //         // 
    //     }

    //     if (y > mapHalfSize) {
    //         // top
    //     } else if (y < -mapHalfSize) {
    //         // bottom
    //     }
    // }

    // /**
    //  * 生成一个对应的地图节点 并返回
    //  * @param i 预制体数组中的索引
    //  * @returns Node 
    //  */
    // spawnNode(i: number = 0) {
    //     if (this.nodePools[i].size() > 0) return this.nodePools[i].get()
    //     else instantiate(this.maps[i])
    // }
    
    // /**
    //  * 
    //  * @param node 
    //  * @description 放回缓冲池
    //  */
    // reclaimNode(node: Node) {
    //     this.nodePools[0].put(node);
    // }
    
    

}


