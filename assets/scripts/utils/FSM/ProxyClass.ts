import { _decorator, Component, Node } from 'cc';
import { Storage } from './Storage';
const { ccclass, property } = _decorator;

@ccclass('ProxyClass')
export class ProxyClass {
    /**
     * 代理构建方法
     * @param className 动态类名称
     * @param option 动态类创建参数
     */
   constructor(className: string, option1:any, option2:any) {
       //一个简单的异常判断，如果存储类中不存在此类 则抛出异常提醒
      if (Storage[className] === undefined || Storage[className] === null) {
        throw new Error(`未找到 className：${className} 对应实现`);
      }
      //从存放对象上找出对应class 创建即可
      return new Storage  [className](option1,option2) 
    }
   }

