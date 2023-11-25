import { _decorator, Component, Node, CCInteger, Label, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('State')
export class State extends Component {
    curExpLabel: Label = null
    maxExpLabel: Label = null
    levelLabel: Label = null
    progress: ProgressBar = null

    start() {
        this.levelLabel = this.node.children[2].getComponent(Label)
        this.curExpLabel = this.node.children[4].getComponent(Label)
        this.maxExpLabel = this.node.children[5].getComponent(Label)
        this.progress = this.node.children[0].getComponent(ProgressBar)
    }

    setAll(level: number, curExp: number, maxExp: number) {
        this.setLevelLabel(level)
        this.setCurExpLabel(curExp)
        this.setMaxExpLabel(maxExp)
    }

    setCurExpLabel(curExp: number) {
        this.curExpLabel.string = curExp.toString()
        this.setProgress()
    }

    setMaxExpLabel(maxExp: number) {
        this.maxExpLabel.string = maxExp.toString()
        this.setProgress()
    }

    setLevelLabel(curLevel: number) {
        this.levelLabel.string = curLevel.toString()
    }

    setProgress() {
        let percent = parseInt(this.curExpLabel.string) / parseInt(this.maxExpLabel.string)
        this.progress.progress = percent
    }



}