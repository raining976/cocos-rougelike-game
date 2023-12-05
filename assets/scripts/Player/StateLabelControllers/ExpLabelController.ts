import { _decorator, Component, Node, Label, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ExpLabelController')
export class ExpLabelController extends Component {
    expLabelNodes = {} // 经验值的相关节点

    curExpLabel = null;
    maxExpLabel = null;
    expBar = null;
    levelLabel = null;


    start() {
        this.initChildren()
        console.log('this.expLabelNodes', this.expLabelNodes)
    }

    /**
     * 获取当前脚本节点上的子节点
     */
    initChildren() {
        this.node.children.forEach(item => {
            this.expLabelNodes[item.name] = item
        });
        this.curExpLabel = this.expLabelNodes['curExp'].getComponent(Label)
        this.maxExpLabel = this.expLabelNodes['maxExp'].getComponent(Label)
        this.expBar = this.expLabelNodes['expBar'].getComponent(ProgressBar)
        this.levelLabel = this.expLabelNodes['level'].getComponent(Label)
    }

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

