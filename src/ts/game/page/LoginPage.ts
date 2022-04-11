import { TextInput, TextInputOptions } from "pixi-textinput-v5";
import { Text } from "pixi.js";
import { GDanger, GTip } from "../../aler/game";
import { autoLogin, gameWidth } from "../../config";
import { RecordController } from "../../net/Record";
import { Button } from "../components/Button";
import type { Game } from "../Game";
import { Page } from "./base/Page";
const InputOption = (): TextInputOptions => ({
  input: {
    color: 'white',
    fontSize: '14px',
    padding: '5px',
    width: '190px',
    backgroundColor: '#777',
  },
  box: {
    default: {
      fill: 0x111,
      stroke: {
        color: 0xCBCEE0,
        width: 1
      }
    }
  },
});

export class LoginPage extends Page {

  unameTip = new Text('用户名', {
    fontSize: 14,
    fill: 0xffffff
  });

  upassTip = new Text('密码', {
    fontSize: 14,
    fill: 0xffffff
  });

  unameInput = new TextInput(InputOption());
  upassInput = new TextInput(InputOption());

  loginBtn = new Button('登录');

  constructor(game: Game) {
    super(game);

    this.unameTip.position.set((gameWidth >> 1) - 200, 155);
    this.upassTip.position.set((gameWidth >> 1) - 200, 215);

    this.unameInput.position.set((gameWidth >> 1) - 100, 150);
    this.upassInput.position.set((gameWidth >> 1) - 100, 210);

    this.loginBtn.position.set((gameWidth >> 1) - 200, 300);

    this.addChild(this.unameTip, this.upassTip, this.unameInput, this.upassInput, this.loginBtn);

    //@ts-ignore
    this.loginBtn.on('pointertap', async () => {
      const uname = this.unameInput.text as unknown as string;
      const upass = this.upassInput.text as unknown as string;

      try {
        await RecordController.login(uname, upass);
        new GTip({ content: '登录成功' });
        this.game.jumpToPage(this.game.mainPage);
      } catch (e: any) {
        new GDanger(e?.response?.data?.msg ?? '登录失败');
      }

    });

  }

  refreshSelf(): void {
    if (__DEV__) {
      if (autoLogin) {
        const uname = autoLogin[0];
        const upass = autoLogin[1];

        (async () => {
          try {
            await RecordController.login(uname, upass);
            new GTip({ content: '登录成功' });
            this.game.jumpToPage(this.game.mainPage);
          } catch (e: any) {
            new GDanger(e?.response?.data?.msg ?? '登录失败');
          }
        })();
      }
    }
  }
}