let autoIncreasedIndex = -99999;
export const StateCache = {

  // 在地面上
  onGround: -101,
  // 通常状态，永久持有
  common: -100,
  // 休息动画
  rest: -99,
  // 走路
  go: 100,
  // 跑
  run: 101,
  // 上跳
  jump: 200,
  // 二段上跳
  jumpSec: 201,
  //  僵直状态
  hard: {
    priority: -200,
    composite: true
  },
  //  霸体
  URA: {
    priority: -300,
    composite: true
  },
  //  无敌
  IME: {
    priority: -400,
    composite: true
  },
  // 下降 自由落体
  drop: 300,
  // 悬浮
  hover: 499,
  // 禁止飞行
  banhover: 500,
  // 普通攻击
  attack: 400,
  // 中毒
  poison: {
    priority: -402,
    composite: true
  },
  // 被击退
  beHitBehind: 501,
  //眩晕
  dizzy: {
    priority: 600,
    composite: true
  },
  //重伤
  hurt: -401,
  // 死亡
  dead: 10000,
  // 减速
  slow: {
    priority: autoIncreasedIndex++,
    composite: true
  },
  // 加速
  fast: {
    priority: autoIncreasedIndex++,
    composite: true
  },
  // 沉默
  silence: {
    priority: autoIncreasedIndex++,
    composite: true
  },
  // 禁锢
  border: {
    priority: autoIncreasedIndex++,
    composite: true
  },

  // 缚地
  linkGround: {
    priority: autoIncreasedIndex++,
    composite: true
  }

} as const;