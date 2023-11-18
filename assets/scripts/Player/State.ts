import { _decorator, Component, Node, CCInteger ,Label} from 'cc';
const { ccclass, property } = _decorator;


@ccclass('State')
export class State extends Component {
    curExpLabel:Label = null
    maxExpLabel:Label = null
    levelLabel:Label = null

    start() {
        this.levelLabel = this.node.children[2].getComponent(Label)
        this.curExpLabel = this.node.children[4].getComponent(Label)
        this.maxExpLabel = this.node.children[5].getComponent(Label)
    }

    setAll(level:number,curExp:number,maxExp:number){
        this.setLevelLabel(level)
        this.setCurExpLabel(curExp)
        this.setMaxExpLabel(maxExp)
    }

    setCurExpLabel(curExp:number){
        this.curExpLabel.string = curExp.toString()
    }

    setMaxExpLabel(maxExp:number){
        this.maxExpLabel.string = maxExp.toString()
    }

    setLevelLabel(curLevel:number){
        this.levelLabel.string = curLevel.toString()
    }

   
    
}