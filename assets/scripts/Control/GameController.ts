import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, director, game, Vec3, Canvas } from 'cc';
const { ccclass, property } = _decorator;

//游戏的四种状态
export enum GameState {
    GS_INIT,        //打开界面的时候
    GS_PLAYING,     //点完开始按钮的时候
    GS_PAUSE,       //暂停游戏，打开菜单
    GS_END,         //游戏结束，打开结束菜单
};

@ccclass('GameController')
export class GameController extends Component {
    @property({ type: Node })
    public Menu: Node | null = null; // 暂停的菜单
    @property({ type: Node })
    public startMenu: Node | null = null; // 开始的菜单
    @property({ type: Node })
    public endMenu: Node | null = null; // 开始的菜单
    //@property({ type: Animation })
    //public animation: Animation | null = null;

    start() {
        // this.openDebugInfo();
        this.setCurState(GameState.GS_INIT);
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

    //初始游戏，打开开始菜单
    init() {
        director.resume();
        this.hiddenMenu();
        director.pause();
        this.showStartMenu();
    }

    showMenu() {
        if (this.Menu && !this.Menu.activeInHierarchy) {
            this.Menu.active = true
        }

    }

    showStartMenu() {
        if (this.startMenu && !this.startMenu.activeInHierarchy) {
            this.startMenu.active = true
        }
    }

    showEndMenu() {
        if (this.endMenu && !this.endMenu.activeInHierarchy) {
            this.endMenu.active = true
        }
    }

    hiddenMenu() {
        this.Menu.active = false
        this.startMenu.active = false
        this.endMenu.active = false
    }
    isDied() {
        // alert('aaa');
        this.setCurState(GameState.GS_END)
    }
    setCurState(value: GameState) {
        switch (value) {
            case GameState.GS_INIT:
                this.init();
                break;
            case GameState.GS_PLAYING:
                this.hiddenMenu();
                director.resume();
                break;
            case GameState.GS_PAUSE:
                this.showMenu();
                director.pause();
                break;
            case GameState.GS_END:
                this.showEndMenu();
                director.pause();
                break;
        }
    }


    //开始游戏，怪物不生成，打开初始菜单
    onPlayButtonClicked() {
        this.setCurState(GameState.GS_PLAYING);
    }

    //暂停游戏，打开游戏菜单，暂停所有场景
    onPauseButtonClicked() {
        this.setCurState(GameState.GS_PAUSE);
    }

    //退出游戏
    onExitButtonClicked() {
        game.end();
        //director.loadScene('scene')
        this.setCurState(GameState.GS_INIT);
        //director.resume();
    }

    //返回游戏
    onBackButtonClicked() {
        this.setCurState(GameState.GS_PLAYING);
    }

    //重新开始游戏
    onRestartButtonClicked() {
        this.setCurState(GameState.GS_INIT);

    }



    update(deltaTime: number) {
        //this.node.setSiblingIndex(1000);
    }

}
