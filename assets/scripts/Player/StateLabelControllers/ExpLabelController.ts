import { _decorator, Component, Node, Label, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ExpLabelController')
export class ExpLabelController extends Component {
    expLabelNodes = {} // 经验值的相关节点

    @property(Label)curExpLabel = null;
    @property(Label)maxExpLabel = null;
    @property(ProgressBar)expBar = null;
    @property(Label)levelLabel = null;


    setAll(curExp: number, maxExp: number, level: number) {
        this.setCurExp(curExp)
        this.setMaxExp(maxExp)
        this.setLevel(level)
    }

    setCurExp(value: number) {
        this.curExpLabel.string = value.toString()
        this.setExpBar(this.getCurExp() / this.getMaxExp())
    }

    setMaxExp(value: number) {
        this.maxExpLabel.string = value.toString()
        this.setExpBar(this.getCurExp() / this.getMaxExp())
    }

    setLevel(value: number) {
        this.levelLabel.string = value.toString()
    }

    setExpBar(percent: number) {
        this.expBar.progress = percent
    }

    getCurExp() {
        return parseInt(this.curExpLabel.string)
    }

    getMaxExp() {
        return parseInt(this.maxExpLabel.string)
    }

    getLevel() {
        return parseInt(this.levelLabel.string)
    }

    getExpBar() {
        return this.expBar.progress
    }
}

