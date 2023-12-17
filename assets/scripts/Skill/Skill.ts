import { _decorator, Component, Node } from 'cc';
import { skillSettings } from './SkillSettings';
const { ccclass, property } = _decorator;

@ccclass('Skill')
export class Skill extends Component {

    protected id: string
    protected skillName: string; 
    protected damage: number;
    // protected duration: number
    // protected range: number
    // protected releaseInterval: number 

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
        // this.duration = skillSettings[skillName].duration
        // this.range = skillSettings[skillName].range
        // this.releaseInterval = skillSettings[skillName].releaseInterval
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

    // /**
    //  * 获取技能持续时间
    //  * @returns {number} duration 毫秒
    //  */
    // getDuration() {
    //     return this.duration
    // }

    // /**
    //  * 获取技能范围 
    //  * @returns {number} range
    //  */
    // getRange() {
    //     return this.range
    // }

    // /**
    //  * 获取技能释放的时间间隔
    //  * @returns {number} releaseInterval 毫秒
    //  */
    // getReleaseInterval() {
    //     return this.releaseInterval
    // }



}

