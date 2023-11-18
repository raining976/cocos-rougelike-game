import { _decorator, Component, Node, CCInteger ,Label} from 'cc';
const { ccclass, property } = _decorator;


@ccclass('State')
export class State extends Component {
    @property({type: Label}) 
    private expLabel: Label;
    @property({type: Label}) 
    private stateLabel: Label
    @property({type: Label}) 
    private maxLabel: Label;



    start() {
    }


    public newExp(exp:number,max:number,level:number) {
        this.expLabel.string=exp.toString();
        this.stateLabel.string=level.toString();
        this.maxLabel.string=max.toString();
    }

   
    
}