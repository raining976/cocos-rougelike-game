import { _decorator, Component, Label, LabelAtlas, Node, UITransform, director } from 'cc';
import { ENHANCE_TYPE } from './EnhanceSettings';
import { Enhance } from './Enhance';
import { randomRangeInt } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('EnhanceController')
export class EnhanceController extends Component {
    @property(Node) camera: Node | null = null;//获取相机
    onEnable() {
        //当前节点位置、contentsize初始化
        this.node.setPosition(this.camera.getPosition());
        const uiTransform = this.getComponent(UITransform);
        uiTransform.setContentSize(1000, 500);
        //子面板初始化
        this.initEnhancePanel();
    }

    initEnhancePanel() {
        let count: number;
        for (count = 0; count < 3; count ++) {
            let ele: Enhance = new Enhance();
            let typeRand: ENHANCE_TYPE = randomRangeInt(0, ENHANCE_TYPE.LENGTH);
            ele.init(typeRand);
            this.node.children[count].getChildByName("Name").getComponent(Label).string = ele.getName();
            this.node.children[count].getChildByName("Description").getComponent(Label).string = ele.getDescription();
        }
    }

    /**
     * 角色属性提升提升事件回调
     */
    enhance() {
        console.log("属性增强！！");
        //增强面板禁用
        this.node.active = false;
        //场景恢复
        director.startAnimation();
    }
    
    update(deltaTime: number) {
        
    }
}


