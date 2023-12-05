import { _decorator, Component, Label, LabelAtlas, Node, UITransform, director, Button } from 'cc';
import { ENHANCE_TYPE } from './EnhanceSettings';
import { Enhance } from './Enhance';
import { EnhanceAttr } from './EnhanceSettings';
import { randomRangeInt } from 'cc';
import { Player } from '../Player/Player';
import { AttributeController } from '../Player/Controller/AttributeController';
const { ccclass, property } = _decorator;


@ccclass('EnhanceController')
export class EnhanceController extends Component {
    @property(Node) camera: Node | null = null;//获取相机
    @property(Node) playerNode: Node | null = null;//角色节点
    onEnable() {
        this.initButtonClick();
        //当前节点位置、contentsize初始化
        this.node.setPosition(this.camera.getPosition());
        const uiTransform = this.getComponent(UITransform);
        uiTransform.setContentSize(1000, 500);
        //子面板初始化
        this.initEnhancePanel();
    }

    protected onDestroy(): void {
        let index: number;
        for (index = 0; index < 3; index ++)
            this.node.children[index].off(Button.EventType.CLICK, this.enhance, this);
    }
    /**
     * 按钮事件初始化
     */
    initButtonClick() {
        let index: number;
        for (index = 0; index < 3; index ++)
            this.node.children[index].on(Button.EventType.CLICK, this.enhance, this);
    }

    /**
     * 子面板内容初始化
     */
    initEnhancePanel() {
        let count: number;
        for (count = 0; count < 3; count ++) {
            let typeRand: number = randomRangeInt(0, ENHANCE_TYPE.LENGTH);
            //初始化名称
            this.node.children[count].
            getChildByName("Name").getComponent(Label).string = EnhanceAttr[typeRand].name;
            //初始化描述
            this.node.children[count].
            getChildByName("Description").getComponent(Label).string = EnhanceAttr[typeRand].description;
            //获取角色节点的attributecontroller组件
            let attrControllerPlayer = this.playerNode.getComponent(AttributeController);
            //初始化当前等级效果
            this.node.children[count].
            getChildByName("Cur").getComponent(Label).string = "当前属性:" + this.getCurEffection(typeRand)//TODO: 获取当前等级效果信息
            //初始化下一等级效果
            this.node.children[count].
            getChildByName("Next").getComponent(Label).string = "下一级属性:" + this.getCurEffection(typeRand)//TODO: 获取下一等级效果信息
        }
    }

    /**
     * 角色属性提升提升事件回调
     */
    enhance(button: Button) {
        let enhanceName = button.node.getChildByName("Name").getComponent(Label).string;
        switch (enhanceName) {
            case '天生神力':
                this.playerNode.getComponent(AttributeController).improveDamage();
                break;
            case '沐浴回春':
                this.playerNode.getComponent(AttributeController).improveMaxHealth();
                break;
            case '疾风迅影':
                this.playerNode.getComponent(AttributeController).improveSpeed();
                break;
            default:
                console.log("bad enhance!!!");
        }
        //增强面板禁用
        this.node.active = false;
        //场景恢复
        director.startAnimation();
    }

    getCurEffection(type: ENHANCE_TYPE) {
        let curLevel = this.playerNode.getComponent(AttributeController).getPassiveSkillCurLevel(type);
        let result: string = "test";
        switch (type) {
            case ENHANCE_TYPE.ENHANCE_DAMAGE:
                result = this.playerNode.getComponent(AttributeController).computeDamage(curLevel).toString();
                break;
            case ENHANCE_TYPE.ENHANCE_HEALTH:
                result = this.playerNode.getComponent(AttributeController).computeMaxHealth(curLevel).toString();
                break;
            case ENHANCE_TYPE.ENHANCE_SPEED:
                result = this.playerNode.getComponent(AttributeController).computeSpeed(curLevel).toString();
                break;
            default:
                console.log("bad Type!!!");
        }
        return result;
    }

    getNextEffection(type: ENHANCE_TYPE) {
        let nextLevel = this.playerNode.getComponent(AttributeController).getPassiveSkillCurLevel(type) + 1;
        let result: string = "test";
        switch (type) {
            case ENHANCE_TYPE.ENHANCE_DAMAGE:
                result = this.playerNode.getComponent(AttributeController).computeDamage(nextLevel).toString();
                break;
            case ENHANCE_TYPE.ENHANCE_HEALTH:
                result = this.playerNode.getComponent(AttributeController).computeMaxHealth(nextLevel).toString();
                break;
            case ENHANCE_TYPE.ENHANCE_SPEED:
                result = this.playerNode.getComponent(AttributeController).computeSpeed(nextLevel).toString();
                break;
            default:
                console.log("bad Type!!!");
        }
        return result;
    }
    update(deltaTime: number) {
        
    }
}


