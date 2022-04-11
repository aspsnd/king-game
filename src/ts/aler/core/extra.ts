export type MessageOption = {
    close: boolean,
    liveTime: number,
    autoClose: boolean,
    innerHTML: string | undefined,
    element: HTMLElement | undefined,
    content: string,
    hash: string | undefined,
}
export const DefaultOption: MessageOption = {
    close: false,
    liveTime: 3000,
    autoClose: true,
    innerHTML: undefined,
    element: undefined,
    content: 'Bug：请联系网站管理员',
    hash: undefined
}
export class Message {
    static inited = false
    static body = document.createElement('div')
    static init() {
        this.inited = true;
        document.body.appendChild(this.body);
        this.body.className = 'ax-body';
    }
    option: MessageOption
    node: HTMLElement
    constructor(option: { [K in keyof MessageOption]?: MessageOption[K] } | string) {
        if (!new.target.inited) new.target.init();
        let realOption: MessageOption = this.option = typeof option === 'string' ?
            Object.assign({}, DefaultOption, { content: option })
            : Object.assign({}, DefaultOption, option);
        let node;
        let type;
        if (realOption.element) {
            node = realOption.element;
            type = 0;
        } else if (realOption.innerHTML) {
            node = document.createElement('div');
            node.innerHTML = realOption.innerHTML;
            type = 1;
        } else {
            node = document.createElement('div');
            node.className = 'aler';
            node.innerText = realOption.content;
            if (realOption.close) {
                let close = document.createElement('div');
                close.className = 'close';
                node.appendChild(close);
                close.onclick = e => {
                    e.stopPropagation();
                    this.remove();
                }
            }
            type = 2;
        };
        this.node = node;
        if (realOption.autoClose) {
            setTimeout(() => {
                this.remove();
            }, realOption.liveTime);
        };
        if (realOption.hash) {
            node.onclick = e => {
                e.stopPropagation();
                this.remove();
                location.hash = realOption.hash as string;
            }
        };
        new.target.body.insertBefore(node, new.target.body.firstChild);
    }
    remove() {
        this.node.classList.add('closing');
        this.node.onanimationend = e => {
            this.node.remove();
        }
        setTimeout(() => {
            this.node.remove();
        }, 500);
    }
}