import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProjectileGenerate')
export class ProjectileGenerate extends Component {
    @property(Prefab) private Projectile: Prefab;//投射物
    start() {
        let Projectilenode=null;
        Projectilenode=instantiate(this.Projectile);

         
    }

    update(deltaTime: number) {
        
    }
}


