import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, director, Label, game, Vec3, Canvas, settings, AudioSource } from 'cc';
import { EnemySpawner } from '../Enemy/EnemySpawner';
import { EnemyController } from './EnemyController';
import { SkillManager } from '../Skill/SkillManager';
import { AttrManager } from '../Attribution/AttrManager';
import { ExpSpawner } from '../Exp/EnemyDeath/ExpSpawner';
import { FloatLabel } from '../FloatLabel/FloatLabel';
import { GlobalVariable } from './GlobalVariable';
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
    @property(Node) playerState: Node;
    private expSpawner: ExpSpawner;

    private globalVariable: GlobalVariable;

    start() {
        this.playerNode.parent.active = false
        this.setCurState(GameState.GS_INIT);
        EnemyController.instance(this.EnemyBaseNode)
        EnemyController.initEnemy()
        EnemyController.StopEnemy()
        this.expSpawner = this.EnemyBaseNode.getComponent(ExpSpawner)
        //this.Menu.setPosition(this.Menu.position.add(new Vec3(0, 0, 1000)))
        this.globalVariable = this.getComponent(GlobalVariable);
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
        //开始游戏计时
        //this.globalVariable.startTimer();
    }

    resetAll(){
        this.playerNode.getComponent(SkillManager).resetAllSkills();
        this.playerNode.getComponent(AttrManager).resetAttr()
        EnemyController.clearEnemies()
        this.expSpawner.recalaimAllExpBall()
        EnemyController.StopEnemy()
    }

    gameInit() {
        this.resetAll()
        EnemyController.StartEnemy()
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

    createEndMenu() {
        let survivalTimeLabel = this.playerState.getChildByName('runTime').getComponent(Label);
        let killCountLabel = this.playerState.getChildByName('killCount').getComponent(Label);
        let scoreLabel = this.playerState.getChildByName('score').getComponent(Label);

        this.endMenu.getChildByName('survivalTime').getComponent(Label).string = survivalTimeLabel.string;
        this.endMenu.getChildByName('killCount').getComponent(Label).string = killCountLabel.string;
        this.endMenu.getChildByName('score').getComponent(Label).string = scoreLabel.string;
    }

    showEndMenu() {
        if (this.endMenu && !this.endMenu.activeInHierarchy) {
            this.createEndMenu()
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
                this.resumePause()
                break;
            case GameState.GS_PAUSE:
                this.pauseGame()
                break;
            case GameState.GS_END:
                this.gameOver()
                break;
            default:
                break;
        }
    }

    pauseScene(){
        setTimeout(() => {
            director.stopAnimation()
        }, 100);
    }

    resumScene(){
        director.startAnimation()
    }

    pauseGame() {
        EnemyController.StopEnemy()
        // TODO: 技能停止释放 
        this.showMenu();
        this.pauseScene()
        //停止游戏计时
        this.getComponent(GlobalVariable).stopTimer();
    }

    resumePause(){
        EnemyController.StartEnemy()
        this.hiddenMenu();
        this.resumScene();
        this.globalVariable.startTimer();
        //this.getComponent(AudioSource).play();
    } 

    gameRestart() {
        this.hiddenMenu()
        this.resumScene()
        this.gameInit()

        this.globalVariable.restart();
    }

    gameOver() {
        EnemyController.StartEnemy()
        this.showEndMenu();
        this.pauseScene()
        this.node.getChildByName('PlayerBase').getComponent(AudioSource).stop();
        //this.globalVariable.exit();
    }

    backStart(){
        this.resumScene()
        this.playerNode.parent.active = false    
        this.resetAll()
        this.hiddenMenu();
        this.showStartMenu();
        this.globalVariable.exit();
    }






    /**----------事件绑定-------------------------------------------------------------------------------------- */

    //开始游戏，怪物不生成，打开初始菜单
    onPlayButtonClicked() {
        this.playerNode.parent.active = true    
        this.setCurState(GameState.GS_PLAYING);
    }

    //暂停游戏，打开游戏菜单，暂停所有场景
    onPauseButtonClicked() {
        this.setCurState(GameState.GS_PAUSE);
    }

    //退出游戏
    onExitButtonClicked() {
       this.backStart()
    }

    //返回游戏
    onBackButtonClicked() {
        this.setCurState(GameState.GS_PLAYING);
    }

    //重新开始游戏
    onRestartButtonClicked() {
        this.gameRestart()
    }

}

