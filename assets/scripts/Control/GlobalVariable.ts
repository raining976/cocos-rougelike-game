import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GlobalVariable')
export class GlobalVariable extends Component {
    @property(Label) timeLabel: Label;
    @property(Label) scoreLabel: Label;

    private runTime: number = 0;
    private score: number = 0;
    private timer = null;

    protected start(): void {
        this.startTimer()
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
        this.timeLabel.string = this.getRunTimeText()
    }

    public setScore(value: number) {
        this.score = value;
        this.scoreLabel.string = this.score + '分'
    }

    public addScore(value: number = 10) {
        this.setScore(this.score + value)
    }
}

