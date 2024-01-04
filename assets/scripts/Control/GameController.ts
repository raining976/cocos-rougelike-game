import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, director, game, Vec3, Canvas } from 'cc';
import { EnemySpawner } from '../Enemy/EnemySpawner';
import { EnemyController } from './EnemyController';
import { SkillManager } from '../Skill/SkillManager';
import { AttrManager } from '../Attribution/AttrManager';
import { ExpSpawner } from '../Exp/EnemyDeath/ExpSpawner';
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
    public endMenu: Node | null = null; // 结束的菜单
    @property({ type: Node })
    public EnemyBaseNode: Node | null = null; // 怪物生成与挂载的节点
    @property(Node) pauseBtn;
    @property(Node) playerNode: Node;

    private expSpawner:ExpSpawner;

    start() {
        this.setCurState(GameState.GS_INIT);
        EnemyController.instance(this.EnemyBaseNode)
        EnemyController.initEnemy()
        EnemyController.StopEnemy()
        this.expSpawner = this.EnemyBaseNode.getComponent(ExpSpawner)
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
        this.hiddenMenu();
        this.showStartMenu();
    }

    gameInit() {
        // TODO: 将人物属性、技能、怪物生成的等级等属性重置

        // 技能重置
        this.playerNode.getComponent(SkillManager).resetAllSkills();
        this.playerNode.getComponent(AttrManager).resetAttr()

        EnemyController.clearEnemies()
        EnemyController.StartEnemy()
        this.expSpawner.recalaimAllExpBall()
    }

    showMenu() {
        if (this.Menu && !this.Menu.activeInHierarchy) {
            this.Menu.active = true
        }
    }
    showStartMenu() {
        if (this.startMenu && !this.startMenu.activeInHierarchy) {
            this.startMenu.active = true
            this.pauseBtn.active = false

        }
    }

    showEndMenu() {
        if (this.endMenu && !this.endMenu.activeInHierarchy) {
            this.endMenu.active = true
        }
    }
    hiddenMenu() {
        this.Menu.active = false
        this.hiddenStartMenu()
        this.endMenu.active = false
    }
    hiddenStartMenu() {
        this.pauseBtn.active = true
        this.startMenu.active = false
    }


    setCurState(value: GameState) {
        switch (value) {
            //初始化游戏
            case GameState.GS_INIT:
                this.init();
                break;
            case GameState.GS_PLAYING:
                EnemyController.StartEnemy()
                this.hiddenMenu();
                director.resume();
                break;
            case GameState.GS_PAUSE:
                EnemyController.StopEnemy()
                // TODO: 技能停止释放 
                this.showMenu();
                director.pause();
                break;
            case GameState.GS_END:
                EnemyController.StartEnemy()
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
        this.gameInit()
        this.setCurState(GameState.GS_INIT);
    }

    //返回游戏
    onBackButtonClicked() {
        this.setCurState(GameState.GS_PLAYING);
    }

    //重新开始游戏
    onRestartButtonClicked() {
        this.hiddenMenu()
        director.resume()
        this.gameInit()
        // 将所有的内重置
        // 人物属性、技能属性、怪物的生成等
    }


    update(deltaTime: number) {
        //this.node.setSiblingIndex(1000);
    }

    
}

