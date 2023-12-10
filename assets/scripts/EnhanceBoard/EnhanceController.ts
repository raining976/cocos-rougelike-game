import { _decorator, Component, Label, LabelAtlas, Node, UITransform, director, Button, Animation, UIOpacity, Sprite, SpriteFrame, resources, AssetManager } from 'cc';
import { ENHANCE_TYPE } from './EnhanceSettings';
import { Enhance } from './Enhance';
import { EnhanceAttr } from './EnhanceSettings';
import { randomRangeInt } from 'cc';
import { Player } from '../Player/Player';
import { AttrController } from '../Player/Controllers/AttrController';
const { ccclass, property } = _decorator;


@ccclass('EnhanceController')
export class EnhanceController extends Component {
    //@property(Node) camera: Node | null = null;//获取相机
    @property(Node) playerNode: Node | null = null;//角色节点
    private animation: Animation | null = null;

    start() {
        this.node.setPosition(15, 11, 0);
        this.initButtonClick();
        this.initSize()
        //获取动画组件
        this.animation = this.node.getComponent(Animation);
    }

    protected onDestroy(): void {
        let index: number;
        for (index = 0; index < 3; index ++)
            this.node.children[index].off(Button.EventType.CLICK, this.enhance, this);
    }

    initSize() {
        let canvasUITran = this.node.parent.parent.getComponent(UITransform);
        let uiTran = this.node.getComponent(UITransform);
        uiTran.width = canvasUITran.width;
        uiTran.height = canvasUITran.height;
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
     * 面板出现
     */
    boardAppear() {
        //生成信息
        this.createInfo();
        //调节透明度
        this.node.getComponent(UIOpacity).opacity = 255;
        //播放进场动画
        let duration = this.animation.getState('appear').duration;
        console.log('duration',duration)
        this.animation.play('appear');
        setTimeout(() => {
            director.stopAnimation()
        }, duration*1100);
    }
    /**
     * 子面板内容初始化
     */
    createInfo() {
        let count: number;
        for (count = 0; count < 3; count ++) {
            let typeRand: number = randomRangeInt(0, ENHANCE_TYPE.LENGTH);
            //初始化图标
            this.loadImage(count, typeRand);
            //初始化名称
            this.node.children[count].
            getChildByName("Name").getComponent(Label).string = EnhanceAttr[typeRand].name;
            //初始化描述
            this.node.children[count].
            getChildByName("Description").getComponent(Label).string = EnhanceAttr[typeRand].description;
            //获取角色节点的attributecontroller组件
            let attrControllerPlayer = this.playerNode.getComponent(AttrController);
            //初始化当前等级效果
            this.node.children[count].
            getChildByName("Cur").getComponent(Label).string = "当前属性:" + this.getCurEffection(typeRand)//TODO: 获取当前等级效果信息
            //初始化下一等级效果
            this.node.children[count].
            getChildByName("Next").getComponent(Label).string = "下一级属性:" + this.getNextEffection(typeRand)//TODO: 获取下一等级效果信息
        }
    }

    /**
     * 
     */
    loadImage(num: number, type: ENHANCE_TYPE) {
        let imagePath: string = null;
        switch (type) {
            case ENHANCE_TYPE.ENHANCE_DAMAGE:
                imagePath = "EnhanceBoard/Skills/power";
                break;
            case ENHANCE_TYPE.ENHANCE_HEALTH:
                imagePath = "EnhanceBoard/Skills/heart";
                break;
            case ENHANCE_TYPE.ENHANCE_SPEED:
                imagePath = "EnhanceBoard/Skills/speed";
                break;
            default:
                console.log("bad enhance!!");
        }
        resources.load(imagePath, SpriteFrame, (err, res)=>{
            if (err) {
                console.log("图片不存在", err);
            }
            this.node.children[num].getChildByName("Image").getComponent(Sprite).spriteFrame = res;
        })
    }
    /**
     * 角色属性提升提升事件回调
     */
    enhance(button: Button) {
        let enhanceName = button.node.getChildByName("Name").getComponent(Label).string;
        switch (enhanceName) {
            case '神力':
                this.playerNode.getComponent(AttrController).improveDamage();
                break;
            case '生命':
                this.playerNode.getComponent(AttrController).improveMaxHealth();
                break;
            case '迅影':
                this.playerNode.getComponent(AttrController).improveSpeed();
                break;
            default:
                console.log("bad enhance!!!");
        }
        //播放退场动画
        this.animation.play('disappear')
        //调节透明度
        this.node.getComponent(UIOpacity).opacity = 0;
        //场景恢复
        director.startAnimation();
    }

    getCurEffection(type: ENHANCE_TYPE) {
        let curLevel = this.playerNode.getComponent(AttrController).getPassiveSkillCurLevel(type);
        let result: string = "test";
        switch (type) {
            case ENHANCE_TYPE.ENHANCE_DAMAGE:
                result = this.playerNode.getComponent(AttrController).computeDamage(curLevel).toString();
                break;
            case ENHANCE_TYPE.ENHANCE_HEALTH:
                result = this.playerNode.getComponent(AttrController).computeMaxHealth(curLevel).toString();
                break;
            case ENHANCE_TYPE.ENHANCE_SPEED:
                result = this.playerNode.getComponent(AttrController).computeSpeed(curLevel).toString();
                break;
            default:
                console.log("bad Type!!!");
        }
        return result;
    }

    getNextEffection(type: ENHANCE_TYPE) {
        let nextLevel = this.playerNode.getComponent(AttrController).getPassiveSkillCurLevel(type) + 1;
        let result: string = "test";
        switch (type) {
            case ENHANCE_TYPE.ENHANCE_DAMAGE:
                result = this.playerNode.getComponent(AttrController).computeDamage(nextLevel).toString();
                break;
            case ENHANCE_TYPE.ENHANCE_HEALTH:
                result = this.playerNode.getComponent(AttrController).computeMaxHealth(nextLevel).toString();
                break;
            case ENHANCE_TYPE.ENHANCE_SPEED:
                result = this.playerNode.getComponent(AttrController).computeSpeed(nextLevel).toString();
                break;
            default:
                console.log("bad Type!!!");
        }
        return result;
    }
    update(deltaTime: number) {
        
    }
}


