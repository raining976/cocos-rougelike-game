import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END,
};

@ccclass('GameControl')
export class GameControl extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
}


