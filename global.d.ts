declare const __DEV__: boolean;

declare const appCanvas: HTMLCanvasElement;

type QuarkEvents = 'time' | `time_${number}`
  | 'runchange' | 'start' | 'stop'
  | 'getworld' | 'losechild' | 'loseparent' | 'loseworld' | 'getchild' | 'getparent'
  | 'destroy' | 'movex' | 'movey' | 'changey' | 'changex'
  | 'getquark' | 'losequark'

declare namespace GlobalAnxiMixins {
  type WholeQuarkEvents = GlobalAnxiMixins.QuarkEventsHelper[keyof GlobalAnxiMixins.QuarkEventsHelper]

  interface QuarkEventsHelper {
    constructor: QuarkEvents
    stateController: 'losestate' | 'getstate' | `losestate_${number}` | `getstate_${number}` | 'headstatechange'
  }
}


declare namespace Matter {
  const controller: import('./src/ts/anxi/physics/symbol').PhysicsControllerFlag;
  export interface Body {
    [controller]: import('./src/ts/anxi/physics/atom/index').PhysicsController<true>
  }
  export interface Composite {
    [controller]: import('./src/ts/anxi/physics/atom/index').PhysicsController<false>
  }
}

