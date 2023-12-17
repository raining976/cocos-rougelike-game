import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, director, game, Vec3, Canvas } from 'cc';
const { ccclass, property } = _decorator;

//游戏的三种状态
enum GameState {
    GS_PLAYING,
    GS_PAUSE,
    GS_END,
};

@ccclass('GameController')
export class GameController extends Component {
    @property({ type: Node })
    public Menu: Node | null = null; // 开始的 UI

    start() {
        // this.openDebugInfo();
        this.init()
        //this.Menu.setPosition(this.Menu.position.add(new Vec3(0, 0, 1000)))
    }

    // 打开碰撞体调试信息
    openDebugInfo() {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
    }

    init() {
        this.Menu.active = false;
    }

    setCurState(value: GameState) {
        switch (value) {
            case GameState.GS_PLAYING:
                this.gameBack()
                break;
            case GameState.GS_PAUSE:
                this.gamePause()
                break;
            case GameState.GS_END:
                this.gameEnd()

                break;
        }
    }


    gamePause() {
        director.pause();
        this.Menu.active = true;
    }

    gameBack() {
        this.Menu.active = false;
        director.resume();
    }

    gameEnd() {
        this.Menu.active = false;
        // director.end();
        // 
        //game.restart();
        director.loadScene("start");
        director.resume();
    }

    gameReStart() {
        this.Menu.active = false;
        director.end();
        // game.restart();
        director.loadScene("scene");
        director.resume();
    }

    //暂停游戏，打开菜单
    onPauseButtonClicked() {
        this.setCurState(GameState.GS_PAUSE);
    }

    //退出游戏
    onExitButtonClicked() {
        this.setCurState(GameState.GS_END);
    }

    //返回游戏
    onBackButtonClicked() {
        this.setCurState(GameState.GS_PLAYING);

    }

    //重新开始游戏
    onRestartButtonClicked() {
        this.gameReStart()
    }

    //开始游戏
    onPlayButtonClicked() {
        director.loadScene("scene");
    }
    update(deltaTime: number) {
        //this.node.setSiblingIndex(1000);
    }

}

