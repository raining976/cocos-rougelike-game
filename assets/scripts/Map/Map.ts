import { _decorator, Component, Node, Prefab, instantiate, randomRangeInt, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

const SCREEN_HEIGHT: number = 1280;
const SCREEN_WIDTH: number = 720;

const SCREEN_HALF_HEIGHT: number = SCREEN_HEIGHT / 2;
const SCREEN_HALF_WIDTH: number = SCREEN_WIDTH / 2;

@ccclass('Map')
export class Map extends Component {
    @property(Prefab) private backgroundPrefabs: Prefab[] = [];
    @property(Node) private NodePool: Node;


    private targetNode: Node;
    private instancedBackgrounds: Node[][] = [];

    private rows = 3;
    private columns = 3;
    private nodeSize = 1024;

    private playerGridPosX = 0;
    private playerGridPosY = 0;

    public init(targetNode: Node): void {
        this.targetNode = targetNode;

        for (let i = 0; i < this.rows; i++){
            const rowNodes: Node[] = [];
            for (let j = 0; j < this.columns; j++){
                const randomIndex = randomRangeInt(0, this.backgroundPrefabs.length);
                const backgroundNode = instantiate(this.backgroundPrefabs[randomIndex]);
                backgroundNode.setParent(this.NodePool);

                const x = j * this.nodeSize - this.nodeSize + SCREEN_HALF_WIDTH;
                const y = i * this.nodeSize - this.nodeSize + SCREEN_HALF_HEIGHT;
                backgroundNode.setWorldPosition(new Vec3(x, y, 0));

                rowNodes.push(backgroundNode);
            }

            this.instancedBackgrounds.push(rowNodes);
        }
        console.log("instantiated successfully!");
    }

    public gameTick(): void{
        this.tryTileX();
        this.tryTileY();
    }

    private tryTileX() {
        const playerGridPosX = Math.round((this.targetNode.worldPosition.x - SCREEN_HALF_WIDTH) / this.nodeSize);

        if (playerGridPosX < this.playerGridPosX) {
            // move the last column to the left
            const columnIndex = this.columns - 1;
            for (let i = 0; i < this.rows; i++){
                const instancedNode = this.instancedBackgrounds[i][columnIndex];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.x -= this.columns * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);

                this.instancedBackgrounds[i].splice(columnIndex, 1);
                this.instancedBackgrounds[i].unshift(instancedNode);

            }
        } else if (this.playerGridPosX < playerGridPosX) {
            // move the first column to the right
            const columnIndex = 0;
            for (let i = 0; i < this.rows; i++) {
                const instancedNode = this.instancedBackgrounds[i][columnIndex];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.x += this.columns * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);

                this.instancedBackgrounds[i].splice(columnIndex, 1);
                this.instancedBackgrounds[i].push(instancedNode);
            }
        }
        this.playerGridPosX = playerGridPosX;
    }
    
    private tryTileY() {
        const playerGridPosY = Math.round((this.targetNode.worldPosition.y - SCREEN_HALF_HEIGHT) / this.nodeSize);

        if (playerGridPosY < this.playerGridPosY) {
            // move the last row down
            const rowIndex = this.rows - 1;
            const nodesInRow: Node[] = [];
            for (let i = 0; i < this.columns; i++) {
                const instancedNode = this.instancedBackgrounds[rowIndex][i];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.y -= this.rows * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);
                nodesInRow.push(instancedNode);
            }

            this.instancedBackgrounds.splice(rowIndex, 1);
            this.instancedBackgrounds.unshift(nodesInRow);
        } else if (this.playerGridPosY < playerGridPosY) {
            // move the first row up
            const rowIndex = 0;
            const nodesInRow: Node[] = [];
            for (let i = 0; i < this.columns; i++) {
                const instancedNode = this.instancedBackgrounds[rowIndex][i];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.y += this.rows * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);
                nodesInRow.push(instancedNode);
            }

            this.instancedBackgrounds.splice(rowIndex, 1);
            this.instancedBackgrounds.push(nodesInRow);
        }

        this.playerGridPosY = playerGridPosY;
    }
}


