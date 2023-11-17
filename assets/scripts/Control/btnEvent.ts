import { _decorator, Component, Node, director, log, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('btnEvent')
export class btnEvent extends Component {

    gameStartHandler() {
        director.loadScene("scene");
    }
}


