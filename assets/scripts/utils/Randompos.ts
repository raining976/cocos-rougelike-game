import { _decorator, Component, Node, Vec3, randomRange } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Randompos')
export class Randompos extends Component{
    public Xrange_min:number=200;
    public Xrange_max:number=200;
    public Yrange_min:number=200;
    public Yrange_max:number=200;
    public R:number=400;
    /**
     * 圆形坐标生成器
     * @param centerpos 生成中心
     * @returns 
     */
    public CircularSpawner(centerpos:Vec3){
        const angle:number=randomRange(0,2*Math.PI);
        const posX:number=Math.sin(angle)*this.R;
        const posY:number=Math.cos(angle)*this.R;
        const spawnPosition = new Vec3();
        spawnPosition.x = centerpos.x + posX;
        spawnPosition.y = centerpos.y + posY;
        return spawnPosition;
    }
    /**
     * 独立坐标生成器
     * @param centerpos 生成中心
     * @param x 
     * @param y 
     * @returns 
     */
    public IndividualSpawner(centerpos:Vec3,canvepos:Vec3,x:number,y:number){
        const spawnPosition = new Vec3();
        spawnPosition.x = centerpos.x + x-canvepos.x;
        spawnPosition.y = centerpos.y + y-canvepos.y;
        console.log(11,centerpos);
        console.log(spawnPosition);
        return spawnPosition;
    }
    /**
     * 矩形坐标生成器
     * @param centerpos 生成中心
     * @param x1 
     * @param x2 
     * @param y1 
     * @param y2 
     * @returns 
     */
    public RectangleSpawner(centerpos:Vec3,x1?:number,x2?:number,y1?:number,y2?:number){
        let Xrange_min=this.Xrange_min;
        let Xrange_max=this.Xrange_max;
        let Yrange_min=this.Yrange_min;
        let Yrange_max=this.Yrange_max;
        if(x1){
            Xrange_min=x1;
        }
        if(x2){
            Xrange_max=x2;
        }
        if(y1){
            Yrange_min=y1;
        }
        if(y2){
            Yrange_max=y2;
        }
        const posX: number = randomRange(Xrange_min, Xrange_max) * (Math.random() < 0.5 ? 1 : -1);
        const posY: number = randomRange(Yrange_min, Yrange_max) * (Math.random() < 0.5 ? 1 : -1);
        const spawnPosition = new Vec3();
        spawnPosition.x = centerpos.x + posX;
        spawnPosition.y = centerpos.y + posY;
        return spawnPosition;
    }
    public setXrange_min(a:number){
        this.Xrange_min=a;
    }
    public setXrange_max(a:number){
        this.Xrange_max=a;
    }
    public setYrange_min(a:number){
        this.Yrange_min=a;
    }
    public setYrange_max(a:number){
        this.Yrange_max=a;
    }
    /**
      * 矩形坐标生成器参数设置
      * @param a Xrange_min
      * @param b Xrange_max
      * @param c Yrange_min
      * @param d Yrange_max
      */
     setRectangleParameter(a:number,b:number,c:number,d:number){
        this.setXrange_min(a);
        this.setXrange_max(b);
        this.setYrange_min(c);
        this.setYrange_max(d);
     }
     /**
      * 圆形坐标生成器参数设置
      * @param a 生成半径
      */
     setCircleParameter(a:number){
        this.R=a;
     }
}


