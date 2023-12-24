import { _decorator, Component, Node, TiledMapAsset, TiledMap,Vec3 } from 'cc';
const { ccclass, property } = _decorator;

const TILE_SIZE_WIDTH = 32; // 假设瓦片宽度为32
const TILE_SIZE_HEIGHT = 32; // 假设瓦片高度为32
@ccclass('MapManager')
export class MapManager extends Component {
    @property({ type: Node })
    public targetNode: Node = null!
    
    @property({type: TiledMapAsset})
    public tmxAsset: TiledMapAsset = null!

    private mapBlocks: Map<string, Node> = new Map();

    
    start() {
        console.log(this)
        let map = this.node.children
        console.log(map)
        this.onCreateTileMap(this.tmxAsset);
        this.node.setPosition(0, 0);
        console.log(this.node)
    }

    update(deltaTime: number) {   
    }

    loadInitialMapBlocks() {
        this.loadMapBlock(0, 0);
    }

    updateMapBlocks() {
        const playerPos = this.getPlayerBlockPosition();
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const blockKey = `${playerPos.x + x}_${playerPos.y + y}`;
                if (!this.mapBlocks.has(blockKey)) {
                    this.loadMapBlock(playerPos.x + x, playerPos.y + y);
                }
            }
        }
    }
    loadMapBlock(x: number, y: number) {
        const node = new Node();
        this.targetNode.addChild(node);
        node.layer = this.targetNode.layer;
        node.setPosition(new Vec3(x * TILE_SIZE_WIDTH, y * TILE_SIZE_HEIGHT, 0));
        const tiledMap = node.addComponent(TiledMap);
        tiledMap.tmxAsset = this.tmxAsset;

        this.mapBlocks.set(`${x}_${y}`, node);
    }

    getPlayerBlockPosition(): Vec3 {
        // 获取玩家节点在世界坐标系中的位置
        const playerWorldPos = this.node.getWorldPosition();
    
        // 根据玩家的实际位置返回其所在的地图区块坐标
        return new Vec3(
            Math.floor(playerWorldPos.x / TILE_SIZE_WIDTH),
            Math.floor(playerWorldPos.y / TILE_SIZE_HEIGHT),
            0
        );
    }
    
    onCreateTileMap(tmxAsset: TiledMapAsset) {
        this.targetNode!.destroyAllChildren();
        const node = new Node();
        this.targetNode.addChild(node);
        node.layer = this.targetNode.layer;
        const tiledMap = node.addComponent(TiledMap);
        tiledMap.tmxAsset = tmxAsset;
    }
}



