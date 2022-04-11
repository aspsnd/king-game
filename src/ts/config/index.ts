export const canvasWidth = __DEV__ ? 960 : window.innerWidth;
export const canvasHeight = __DEV__ ? 590 : window.innerHeight;


const rateOfWH = 96 / 59;

const realRate = canvasWidth / canvasHeight;

export const Wider = realRate > rateOfWH;

export const gameWidth = Wider ? 590 * realRate : 960;

export const gameHeight = Wider ? 590 : 960 / realRate;


export const useLocalServer = false;
export const netBaseUrl = useLocalServer ? 'http://localhost:10003/' : 'https://www.anxyser.top/server10003/';

export const autoLogin = location.search.length > 3 ? ['tester1', '123456'] : ['tester2', '123456'];