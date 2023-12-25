import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { skillSettings } from './SkillSettings';
const { ccclass, property } = _decorator;

@ccclass('Skill')
export class Skill extends Component {

    protected id: string
    protected skillName: string;
    protected damage: number;
    protected collider:Collider2D = null

    start(){
        this.initCollision()
    }


    /**
     * 初始化技能属性 每次升级后都应该执行一遍此函数
     * 注意是该类的子类调用 
     * 尤其是对于技能飞行物使用节点池的技能 每次释放技能都应该调用此函数
     * 以保证所有的技能节点的技能属性得到了更新
     * @param skillName 技能名字 应和skillSettings中保持严格一致
     */
    initSkill(skillName: string) {
        this.id = skillSettings[skillName].id
        this.skillName = skillSettings[skillName].skillName
        this.damage = skillSettings[skillName].damage
    }

    /**
     * 获取技能id
     * @returns {string} id 
     */
    getId() {
        return this.id
    }

    /**
     * 获取技能名字
     * @returns {string} skillName
     */
    getSkillName() {
        return this.skillName
    }

    /**
     * 获取技能伤害
     * @returns {number} damage 
     */
    getDamage() {
        return this.damage
    }


    // ----------------------------------------------------------------
    // 碰撞相关
    /**
     * 初始化碰撞回调
     */
    initCollision(){
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    /**
     * 开启碰撞组件
     */
    openCollision(){
        this.collider.enabled = true
    }

    /**
     * 关闭碰撞组件
     */
    closeCollision(){
        this.collider.enabled = false
    }

    /**
     * 碰撞回调 需重写 针对那些碰撞后消失的技能以及其他处理
     * @param selfCollider 自己的碰撞体
     * @param otherCollider 另一个碰撞体
     * @param contact 
     */
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {}

}

