import { _decorator, Component, Label, LabelAtlas, Node, UITransform, director, Button, Animation, UIOpacity, Sprite, SpriteFrame, resources, AssetManager, Layout, VerticalTextAlignment, Prefab, instantiate, settings, NodePool, labelAssembler } from 'cc';
import { ENHANCE_TYPE } from './EnhanceSettings';
import { enhanceSettings } from './EnhanceSettings';
import { randomRangeInt } from 'cc';
import { AttrController } from '../Player/Controllers/AttrController';
import { SkillManager } from '../Skill/SkillManager';
import { EnhanceItem } from './EnhanceItem';
import { SkillSettings, skillSettings } from '../Skill/SkillSettings';
import { AttrSettings, attrSettings } from '../Attribution/AttrSettings';
import { AttrManager } from '../Attribution/AttrManager';
const { ccclass, property } = _decorator;



@ccclass('EnhanceController')
export class EnhanceController extends Component {
    /** 一个升级列表item的预制体 */
    @property(Prefab) upgradeItemPrefab: Prefab = null;
    @property(Node) playerNode: Node | null = null;
    /** 升级列表节点的节点池 */
    private nodePool: NodePool = new NodePool();
    /** 当前升级列表节点的缓冲容器 */
    private curNodesContainer: Node[] = []
    /** 技能管理器 */
    private skillManager: SkillManager;
    /** 属性管理器 */
    private attrManager: AttrManager
    /** 升级面板列表的个数 */
    private upgradeItemCount = 4;
    /** 随机提升属性数组 */
    private randomAttrSettingsKeys = []
    /** 随机提升技能的数组 */
    private randomSkillSettingsKeys = []

    start() {
        this.skillManager = this.playerNode.getComponent(SkillManager);
        this.attrManager = this.playerNode.getComponent(AttrManager)
        this.loadImage()
    }

    /**
     * 面板出现
     */
    boardAppear() {
        this.node.getComponent(UIOpacity).opacity = 255;

        this.loadItemNodes()
        setTimeout(() => {
            director.stopAnimation();
        },300);
    }

    /**
     * 从传入的obj中随机获取num个其中的key
     * @param obj 
     * @param num 
     * @returns keys数组
     */
    getRadomSettingsKeys(obj: SkillSettings | AttrSettings, num: number, isSkill: boolean) {
        let keys = Object.keys(obj)
        const curLevel_index: string = isSkill ? 'skillLevel' : 'attrLevel';
        let len = keys.length;
        for (let i = len - 1; i >= 0; --i) {
            let curLevel = obj[keys[i]][curLevel_index]
            let maxLevel = obj[keys[i]].upgradeArray.length + 1
            if ( maxLevel == curLevel )
                keys.splice(i,1);
        }
        if(keys.length < num){
            return keys
        }

        const randomKeys = []
        for (let i = 0; i < num; i++) {
            let len = keys.length
            let randomIndex = randomRangeInt(0, len)
            randomKeys.push(keys[randomIndex])
            keys.splice(randomIndex, 1)
        }
        return randomKeys
    }


    /**
     * 生成一个列表item节点
     * @returns Node
     */
    spawnNode() {
        return this.nodePool.size() > 0 ? this.nodePool.get() : instantiate(this.upgradeItemPrefab)
    }

    /**
     * 回收节点
     * @param node 要回收的节点 
     */
    reclaimNode(node: Node) {
        this.offBtnClick(node)
        this.nodePool.put(node)
    }

    /**
     * 解除事件绑定
     * @param node 要解除的节点的绑定事件
     */
    offBtnClick(node: Node) {
        node.off(Button.EventType.CLICK, this.enhance, this);
    }

    /**
     * 注册节点点击事件
     * @param node 要注册的节点
     */
    onBtnClick(node: Node) {
        node.on(Button.EventType.CLICK, this.enhance, this);
    }

    /**
     * 加载所有的列表item节点
     */
    loadItemNodes() {
        this.randomAttrSettingsKeys = this.getRadomSettingsKeys(attrSettings, this.upgradeItemCount / 2, false)
        this.randomSkillSettingsKeys = this.getRadomSettingsKeys(skillSettings, this.upgradeItemCount / 2, true)
        let len = this.randomAttrSettingsKeys.length + this.randomSkillSettingsKeys.length;
        for (let i = 0; i < len; i++) {
            const itemNode = this.spawnNode()
            this.curNodesContainer.push(itemNode)
            this.onBtnClick(itemNode)
            this.node.addChild(itemNode)
        }

        this.setNodes()
    }

    setNodes() {
        var startIndex = 0
        this.randomAttrSettingsKeys.forEach(key => {
            const itemNode = this.curNodesContainer[startIndex++]
            itemNode.getComponent(EnhanceItem).setIsSkill(false);
            itemNode.getComponent(EnhanceItem).init(attrSettings[key].attrName, false, attrSettings[key].imgSource)
        })
        this.randomSkillSettingsKeys.forEach(key => {
            const itemNode = this.curNodesContainer[startIndex++]
            itemNode.getComponent(EnhanceItem).setIsSkill(true);
            itemNode.getComponent(EnhanceItem).init(skillSettings[key].skillName, true, skillSettings[key].imgSource)
        })
    }

    /**
     * 从资源文件夹中加载目标缩略图
     * @param key key
     * @param path 路径
     */
    loadImage() {
        Object.keys(skillSettings).forEach(key => {
            resources.load(skillSettings[key].imgPath, SpriteFrame, (err, res) => {
                if (err) {
                    console.log("图片不存在", err)
                }
                skillSettings[key].imgSource = res
            })
        })

        Object.keys(attrSettings).forEach(key => {
            resources.load(attrSettings[key].imgPath, SpriteFrame, (err, res) => {
                if (err) {
                    console.log("图片不存在", err)
                }
                attrSettings[key].imgSource = res
            })
        })
    }

    /**
     * 卸载节点
     */
    unloadItemNodes() {
        this.curNodesContainer.forEach(node => {
            this.reclaimNode(node)
        })
        this.curNodesContainer = []
    }

    /**
     * 角色属性提升提升事件回调
     */
    enhance(button: Button) {

        const isSkill = button.getComponent(EnhanceItem).getIsSkill()
        const enhanceName = button.getComponent(EnhanceItem).getEnhanceName()
        if (isSkill) {
            this.skillManager.upgradeSkill(enhanceName)
        } else {
            this.attrManager.upgradeAttr(enhanceName)
        }
        this.unloadItemNodes()
        this.disappearBoard()
    }

    /**
     * 隐藏升级面板
     */
    disappearBoard() {
        this.node.getComponent(UIOpacity).opacity = 0;
        //场景恢复
        director.startAnimation();
    }

}


