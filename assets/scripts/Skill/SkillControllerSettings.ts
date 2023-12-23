import { _decorator, Component, Node } from 'cc';
import { SkillController } from './SkillController';
import { SpinBallController } from './SpinBall/SpinBallController';
import { StraightBallController } from './StraightBall/StraightBallController';
import { BombController } from './Bomb/BombController';
import { Bomb } from './Bomb/Bomb';
const { ccclass, property } = _decorator;

/**
 * 技能控制器的映射
 */
@ccclass('SkillControllerSettings')
class SkillControllerSettings {
    [skillName: string]: {
        /** 对应技能控制类 */
        controller: typeof SkillController
    }
}

export const skillControllerSettings = new SkillControllerSettings();

skillControllerSettings['SpinBall'] = {
    controller: SpinBallController
}

skillControllerSettings['StraightBall'] = {
    controller: StraightBallController
}

skillControllerSettings['Bomb'] = {
    controller: BombController
}

