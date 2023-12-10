import { _decorator, Component, Node, Label ,ProgressBar} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BloodLabelController')
export class BloodLabelController extends Component {
    @property(Label) curHealthLabel  = null
    @property(Label) maxHealthLabel  = null
    @property(ProgressBar)bloodBar = null

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

