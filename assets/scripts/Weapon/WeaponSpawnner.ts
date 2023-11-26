import { _decorator, Component, Node, Prefab, Vec3, instantiate, tween, UITransform } from 'cc';
import { Player } from '../Player/Player';
const { ccclass, property } = _decorator;

@ccclass('WeaponSpawnner')
export class WeaponSpawnner extends Component {
    @property(Prefab) private weapons: Prefab[] = []; // 引擎预先注入武器预制体数组
    @property(Node) private player: Node

    curWeaponNodes: Array<Node> = []; // 当前武器节点数组

    start() {
        setTimeout(() => {
            this.init()
        }, 300);
    }

    init() {
        let weaponCount = this.player.getComponent(Player).getWeaponCount();
        for (let i = 0; i < weaponCount; i++) {
            this.addWeapon();
        }
        this.resetRotateAnim()
    }

    /**
     * 捡到新武器
     */
    changeWeapon() {
        this.destroyWeapons() // 先销毁原有的武器
        let weaponCount = this.player.getComponent(Player).getWeaponCount() // 获取当前武器数量
        for (let i = 0; i < weaponCount; i++) {
            this.addWeapon(false)
        }
        this.resetRotateAnim()
    }

    /**
     * 添加一把当前武器挂到人物节点
     * @param isResetAnim 是否需要重置动画 默认为true
     */
    addWeapon(isResetAnim: boolean = true) {
        let weaponPrefab = this.getCurPrefab();
        this.curWeaponNodes.push(this.spawnWeapon(weaponPrefab))
        isResetAnim && this.resetRotateAnim()
    }

    /**
     * 重置武器旋转动画 用在增加武器的时候
     */
    resetRotateAnim() {
        let deltaAngle = 360 / this.curWeaponNodes.length
        for (let i = 0; i < this.curWeaponNodes.length; i++) {
            this.rotateWeapon(this.curWeaponNodes[i], i * deltaAngle)
        }
    }

    /**
     * 销毁当前所有武器节点
     */
    destroyWeapons() {
        for (let i = 0; i < this.curWeaponNodes.length; i++) {
            this.curWeaponNodes[i].removeFromParent()
        }
        this.curWeaponNodes = []
    }

    /**
     * 获取当前武器的预制体
     * @returns Prefab 武器预制体
     */
    getCurPrefab() {
        let weaponName = this.player.getComponent(Player).getWeaponName() || 'default';
        return this.weapons.find(weapon => weapon.name === weaponName)
    }

    /**
     * 生成一个武器
     */
    spawnWeapon(weaponPrefab: Prefab) {
        const spawnPosition = new Vec3(0, -10, 999); // -10是因为人物的素材不是在图像的最中间
        let weaponNode = instantiate(weaponPrefab);
        // 设置武器的锚点在人物中心偏上
        weaponNode.getComponent(UITransform).setAnchorPoint(0.5, -0.3)
        weaponNode.setPosition(spawnPosition);
        this.player.addChild(weaponNode);
        return weaponNode
    }

    /**
     * 给武器添加转动的缓动动画
     * @param weaponNode 武器节点
     * @param startAngle 开始角度 默认 0
     * @param duration 持续实现 默认 1秒
     */
    rotateWeapon(weaponNode: Node, startAngle: number = 0, duration: number = 1.5) {
        tween(weaponNode)
            .to(0, { angle: startAngle })
            .to(duration, { angle: 360 + startAngle })
            .union()
            .repeatForever()
            .start();
    }
}

