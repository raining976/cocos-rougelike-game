import { _decorator, Component, Node, Label ,ProgressBar} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BloodLabelController')
export class BloodLabelController extends Component {
    bloodLabelNodes = {} // 血量的相关节点

    curHealthLabel  = null
    maxHealthLabel  = null
    bloodBar = null

    start() {
        this.initChildren()
    }
    
    /**
     * 获取当前脚本节点上的子节点
     */
    initChildren() {
        this.node.children.forEach(item => {
            this.bloodLabelNodes[item.name] = item
        });
        
        this.curHealthLabel = this.bloodLabelNodes['curHealth'].getComponent(Label)
        this.maxHealthLabel =   this.bloodLabelNodes['maxHealth'].getComponent(Label)
        this.bloodBar = this.bloodLabelNodes['bloodBar'].getComponent(ProgressBar)
    }

    setAll(curBlood: number, maxBlood: number) {
        this.setCurBlood(curBlood)
        this.setMaxBlood(maxBlood)
    }


    setCurBlood(value: number) {
        this.curHealthLabel.string = value.toString()
        this.setBloodBar(this.getCurBlood()/this.getMaxBlood())
    }

    setMaxBlood(value: number) {
        this.maxHealthLabel.string = value.toString()
        this.setBloodBar(this.getCurBlood()/this.getMaxBlood())
    }

    setBloodBar(percent: number) {
        this.bloodBar.progress = percent
    }

    getCurBlood() {
        return parseInt(this.curHealthLabel.string)
    }

    getMaxBlood() {
        return parseInt(this.maxHealthLabel.string)
    }

    getBloodBar() {
        return this.bloodBar.progress
    }




}

