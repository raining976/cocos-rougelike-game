import { _decorator, Component, Label, Node } from 'cc';
import { EnemySpawner } from '../Enemy/EnemySpawner';
const { ccclass, property } = _decorator;

enum STAGE {
    ONE = 0,
    TWO = 90,
    THREE = 180,
}
@ccclass('GlobalVariable')
export class GlobalVariable extends Component {
    @property(Label) timeLabel: Label;
    @property(Label) scoreLabel: Label;
    @property(Label) killCountLabel: Label;

    private runTime: number = 0;
    private score: number = 0;
    private killCount: number = 0;
    private timer = null;

    private enemySpawner: EnemySpawner;
    private trashFishSpawnDelayArray = [0.5, 0.3, 0.1]
    private bossSpawnDelayArray = [30, 20, 10]

    protected start(): void {
        this.enemySpawner = this.node.getChildByName('NodePool').getComponent(EnemySpawner);
    }

    public restart() {
        this.clearVariable()
        this.startTimer()
    }

    public exit() {
        this.clearVariable()
    }

    public clearVariable() {
        this.setRunTime(0)
        this.setScore(0)
        this.setKillCount(0)
        this.stopTimer()
    }

    public startTimer() {
        this.timer = setInterval(() => {
            this.setRunTime(this.runTime + 1)
        }, 1000)
    }

    public stopTimer() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }

    public getRunTimeText(): string {
        let m = Math.floor(this.runTime / 60), s = this.runTime % 60;
        let mm = m < 10 ? '0' + m : m;
        let ss = s < 10 ? '0' + s : s
        return mm + ' : ' + ss
    }

    public getRunTime(): number {
        return this.runTime;
    }

    public getScore(): number {
        return this.score;
    }

    public setRunTime(value: number) {
        this.runTime = value;
        this.timeLabel.string = 'Survival Time: ' + this.getRunTimeText();
        if (this.enemySpawner)
            this.resetSpawnDelay(this.runTime);
    }

    public resetSpawnDelay(runTime: number) {
        if (runTime == STAGE.ONE) {
            this.enemySpawner.setSpawnerDelay(this.trashFishSpawnDelayArray[0]);
            this.enemySpawner.setBossSpawnerDeley(this.bossSpawnDelayArray[0]);
        }
        if (runTime == STAGE.TWO) {
            this.enemySpawner.setSpawnerDelay(this.trashFishSpawnDelayArray[1]);
            this.enemySpawner.setBossSpawnerDeley(this.bossSpawnDelayArray[1]);
        }
        if (runTime == STAGE.THREE) {
            this.enemySpawner.setSpawnerDelay(this.trashFishSpawnDelayArray[2]);
            this.enemySpawner.setBossSpawnerDeley(this.bossSpawnDelayArray[2]);
        }
    }
            

    public setScore(value: number) {
        this.score = value;
        this.scoreLabel.string = 'Score: ' + this.score;
    }

    public addScore(value: number = 10) {
        this.setScore(this.score + value)
    }

    public getKillCount(): number {
        return this.killCount;
    }
    public setKillCount(value: number) {
        this.killCount = value;
        this.killCountLabel.string = 'Kill Count:' + this.killCount;
    }

    public addKillCount(value: number = 1) {
        this.setKillCount(this.killCount + value);
    }

}

