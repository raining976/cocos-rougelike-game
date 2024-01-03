import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export class WeightTable{//权重表
    name:string
    weight:number
    constructor(name:string,weight:number){
        this.name=name;
        this.weight=weight;
    }
}
/**
 * 因为这个我也是打算尽可能把它做成一个泛用的类，所以我就没有使用单例，同时init函数也采用了泛型
 */
@ccclass('RandomwithWeight')
export class RandomwithWeight extends Component {
    private weighttables:WeightTable[]=[];//权重表，方便建立权重区间(进行加权随机)
    // private weightset:Map<string,number>=new Map()//权重集合，方便查找(修改权重)
    /**
     * 初始化权重表
     * @param tableowner 建立权重表的对象,需为包含name属性（string类型）的Array对象
     * @param weightsource 权重来源
     * @param weightsource 权重来源索引
     */
    init<T extends{name:string}>(tableowner:Array<T>,weightsource:any,sourceindex:any):void{//泛型约束，T必须包含string类型的name属性
        for(let i=0;i<tableowner.length;i++){
            this.weighttables.push(new WeightTable(tableowner[i].name,weightsource[sourceindex[i].name].weight));
        }
    }
    /**
     * 构建权重区间,权重区间左开右闭，因而随机数不可包含0
     * @param stpos 构建起始索引，默认为1
     * @returns 权重上界
     */
    RangeGenerate(stpos:number=1):number{
        for(let i=stpos;i<this.weighttables.length;i++){
            this.weighttables[i].weight+=this.weighttables[i-1].weight;
        }
        return this.weighttables[this.weighttables.length-1].weight;
    }
    /**
     * 二分查找给出随机数所属权重区间
     * @param weight 随机数
     * @returns 所属权重区间id
     */
    location(weight:number):number{
        let top=this.weighttables.length;
        let floor=0;
        while(top>floor){
            let middle=Math.floor(floor+(top-floor)/2);
            if(this.weighttables[middle].weight<weight){
                floor=middle+1;
            }
            else{
                top=middle;
            }
        }
        return top;
    }
    /**
     * 更新权重表
     * @param name 需更新权重的对象
     * @param NewWeight 新权重
     * @returns 
     */
    RefreshWeight(name:string,NewWeight:number):void{
        if(this.weighttables.length==0){
            console.log("权重表未建立");
            return;
        }
        for(let i=0;i<this.weighttables.length;i++){
            if(this.weighttables[i].name==name){
                this.weighttables[i].weight=NewWeight;
                this.RangeGenerate[i];
                return;
            }
        }
    }
    /**
     * 获取权重表
     * @returns 权重表
     */
    gettable():WeightTable[]{
        return this.weighttables;
    }
}


