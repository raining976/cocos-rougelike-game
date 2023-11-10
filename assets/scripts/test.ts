import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {
    start() {
        console.log(this.node.getWorldPosition());
    }

    update(deltaTime: number) {
        
    }
}


