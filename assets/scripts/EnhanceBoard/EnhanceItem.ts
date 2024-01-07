import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { skillSettings } from '../Skill/SkillSettings';
import { attrSettings } from '../Attribution/AttrSettings';
const { ccclass, property } = _decorator;

@ccclass('EnhanceItem')
export class EnhanceItem extends Component {

    private curLevel:number;
    private description = '';
    private enhanceNameZh = '';
    private enhanceName = '';

    private isSkill = true;

    @property(Label) curLevelLabel:Label;
    @property(Label) enhanceNameLabel:Label;
    @property(Label) descriptionLabel:Label;
    @property(Sprite) imgSprite:Sprite

    
    init(enhanceName: string, isSkill: boolean,imgSource:SpriteFrame) {
        this.imgSprite.spriteFrame = imgSource
        if (isSkill == true) {
            this.enhanceName = enhanceName
            this.curLevel = skillSettings[enhanceName].skillLevel
            this.description = skillSettings[enhanceName].upgradeArray[this.curLevel].description || ""
            this.enhanceNameZh = skillSettings[enhanceName].skillNameZh
        } else {
            this.enhanceName = enhanceName
            this.curLevel = attrSettings[enhanceName].attrLevel;
            this.description = attrSettings[enhanceName].upgradeArray[this.curLevel].description || ""
            this.enhanceNameZh = attrSettings[enhanceName].attrNameZh
        }
        this.updateLabel()
    }

    updateLabel(){
        this.curLevelLabel.string = this.curLevel.toString()
        this.descriptionLabel.string = this.description
        this.enhanceNameLabel.string = this.enhanceNameZh
    }


    getEnhanceName(){
        return this.enhanceName;
    }

    getIsSkill() {
        return this.isSkill;
    }

    setIsSkill(isSkill: boolean) {
        this.isSkill = isSkill;
    }

}


