import { _decorator, Component, Node, CCInteger, Label, ProgressBar } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;


@ccclass('State')
export class State extends Component {
    curExpLabel: Label = null
    maxExpLabel: Label = null
    levelLabel: Label = null
    maxHeaLabel: Label = null
    curHeaLabel: Label = null
    progress: ProgressBar = null
    bloodBar: ProgressBar = null
    playerAttr: Player | null = null;//角色属性组件

    start() {
        this.playerAttr = this.node.getComponent(Player);
        this.levelLabel = this.node.children[2].getComponent(Label)
        this.curExpLabel = this.node.children[4].getComponent(Label)
        this.maxExpLabel = this.node.children[5].getComponent(Label)
        this.maxHeaLabel=this.node.children[8].getComponent(Label)
        this.curHeaLabel=this.node.children[9].getComponent(Label)
        this.progress = this.node.children[0].getComponent(ProgressBar)
        this.bloodBar = this.node.children[7].getComponent(ProgressBar)
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

    setCurHea(curHea:number){
        this.curHeaLabel.string=curHea.toString();
    }

    setMaxHea(maxHea:number){
        this.maxHeaLabel.string=maxHea.toString();
    }

    setBloodBar(curHea:number,maxHea:number){
        this.bloodBar.progress=curHea/maxHea;
    }

    setHea(curHea:number,maxHea:number){
        this.setCurHea(curHea);
        this.setMaxHea(maxHea);
        this.setBloodBar(curHea,maxHea);
    }
}