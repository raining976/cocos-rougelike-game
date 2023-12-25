import { _decorator, Component, Node, TiledMapAsset, TiledMap,Vec3, Vec2, TiledLayer } from 'cc';
const { ccclass, property } = _decorator;

enum MoveDirection {
    NONE = 0,
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4,
}

const TILE_SIZE_WIDTH = 32; // 假设瓦片宽度为32
const TILE_SIZE_HEIGHT = 32; // 假设瓦片高度为32
const minTilesCount = 9;

@ccclass('MapManager')
export class MapManager extends Component {

    _isMapLoaded = false;

    @property({ type: Node })
    public targetNode: Node = null!
    
    @property({type: TiledMapAsset})
    public tmxAsset: TiledMapAsset = null!

    private mapBlocks: Map<string, Node> = new Map();

    private _curTile = new Vec2();
    private _startTile = new Vec2();
    private _endTile = new Vec2();
    private _tiledMap: TiledMap = null!;
    // private _layer1: TiledLayer = null!;
    // private _layer2: TiledLayer = null!;

    start() {
        console.log(this)
        let map = this.node.children
        console.log(map)
        this.onCreateTileMap(this.tmxAsset);
        this.node.setPosition(0, 0);
        console.log(this.node)


        this._initMapPos();
    }

    update(deltaTime: number) {   
    }

    _initMapPos() {
        this.node.setPosition(0, 0);
    }

    _getTilePos(posInPixel: { x: number, y: number }) {
        const mapSize = this.node._uiProps.uiTransformComp!.contentSize;
        const tileSize = this._tiledMap.getTileSize();
        const x = Math.floor(posInPixel.x / tileSize.width);
        const y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);

        return new Vec2(x, y);
    }

    _tryMoveMap(moveDir: MoveDirection) {
        
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



