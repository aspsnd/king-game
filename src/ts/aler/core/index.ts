import "./index.scss";
export function form2json(dom: HTMLElement) {
    let data: { [key: string]: string } = {};
    dom.querySelectorAll('input[name]').forEach(ele => {
        data[ele.getAttribute('name')!] = (ele as HTMLInputElement).value;
    })
    return data;
}

export class DomHelper {
    static toDom(data: { [key: string]: any }, model: HTMLElement, _class = model.className) {
        var dom = document.createElement(model.tagName);
        var html = model.innerHTML || '<div></div>';
        (html.match(/{{(.*?)}}/g) || []).forEach(str => {
            let key = str.substring(2).replace('}}', '')
            html = html.replace(str, data[key] !== undefined ? data[key] : ' ');
        })
        dom.innerHTML = html;
        //@ts-ignore
        dom._data = data;
        dom.className = _class;
        dom.classList.remove('hide');
        dom.onclick = model.onclick;
        dom.oncontextmenu = model.oncontextmenu;
        return dom;
    }
}
export type AlerHook<T> = ((this: AlerConstructor<T>) => void) | undefined
export interface AlerConstructor<T> {
    option: T,
    node: HTMLElement
    submitedForm: { [key: string]: string }
    remove(): void
    onCreate: AlerHook<T>,
    onSubmit: ((this: AlerConstructor<T>, form: { [key: string]: string }) => void) | undefined,
    onClose: AlerHook<T>
    onRemove?: AlerHook<T>,
}
export type AlerFactoryOptions<T, K> = {
    model: HTMLElement,
    cover?: string
    onCreate?: AlerHook<T>,
    onSubmit?: ((this: AlerConstructor<T>, form: { [key: string]: string }) => void) | undefined,
    onClose?: AlerHook<T>,
    onRemove?: AlerHook<T>,
    baseAlerOption: T,
    staticParam?: K
}
export interface AlerHandlerInterface<T> {
    onCreate?: AlerHook<T>,
    onCreateEnd?: AlerHook<T>,
    onSubmit?: ((this: AlerConstructor<T>, form: { [key: string]: string | number }) => void) | undefined,
    onClose?: AlerHook<T>,
    onRemove?: AlerHook<T>,
}

export class AlerFactory {
    static create<T extends { [key: string]: string | number | boolean | any[] }, K>(classOptions: HTMLElement | AlerFactoryOptions<T, K>) {
        let classOption = {
            baseAlerOption: {},
            cover: 'ax-cover'
        } as AlerFactoryOptions<T, K>;
        if (classOptions instanceof HTMLElement) {
            classOption.model = classOptions;
        } else {
            classOption = Object.assign(classOption, classOptions);
        };

        return class Aler {
            static staticParam = classOption.staticParam
            static baseOption = classOption.baseAlerOption;
            node: HTMLElement
            submitedForm: { [key: string]: string } = {}
            option: T
            constructor(options?: { [key in keyof T]?: string | any[] | number | boolean } & AlerHandlerInterface<T>) {
                this.option = Object.assign({}, Aler.baseOption, options);
                let node = DomHelper.toDom(this.option, classOption.model);
                node.addEventListener('wheel', e => {
                    if (e.target === node) {
                        e.preventDefault();
                    }
                }, {
                    capture: true
                });
                node.addEventListener('touchmove', e => {
                    if (e.target === node) {
                        e.preventDefault();
                    }
                }, {
                    capture: true
                });
                (node.querySelector('.aler')! as HTMLDivElement).addEventListener('wheel', e => {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                }, {
                    capture: true
                });
                let lastY = 0;
                (node.querySelector('.aler')! as HTMLDivElement).addEventListener('touchstart', e => {
                    lastY = e.touches[0].pageY;
                }, {
                    capture: true
                });
                (node.querySelector('.aler')! as HTMLDivElement).addEventListener('touchmove', e => {
                    const target = e.target as HTMLDivElement;
                    const deltaY = e.changedTouches[0].pageY - lastY;
                    lastY = e.changedTouches[0].pageY;
                    if (deltaY < 0) {
                        if (target.scrollTop + 2 > target.scrollHeight - target.clientHeight) {
                            e.preventDefault();
                        }
                    } else {
                        if (target.scrollTop < 1) {
                            e.preventDefault();
                        }
                    }
                }, {
                    capture: true
                });
                node.className = classOption.cover!;
                this.node = node;
                document.body.appendChild(node);
                this.onCreate = options?.onCreate ?? this.onCreate;
                this.onCreateEnd = options?.onCreateEnd;
                this.onSubmit = options?.onSubmit ?? this.onSubmit;
                this.onClose = options?.onClose ?? this.onClose;
                this.onRemove = options?.onRemove ?? this.onRemove;
                this.onCreate?.();
                this.onCreateEnd?.();
                this.result = new Promise((resolve) => {
                    node.onclick = e => {
                        let target = e.target as HTMLElement;
                        if (target.hasAttribute('submit')) {
                            this.submitedForm = form2json(node);
                            this.onSubmit?.(this.submitedForm);
                            this.remove();
                            resolve([true, this.submitedForm])
                        } else if (target.hasAttribute('cancel')) {
                            this.onClose?.();
                            this.remove();
                            resolve([false]);
                        }
                    }
                })
            }
            remove() {
                this.node.onclick = null;
                this.node.remove();
                this.onRemove?.();
            }
            onCreate: AlerHook<T> = classOption.onCreate
            onCreateEnd?: AlerHook<T>
            onSubmit: ((this: AlerConstructor<T>, form: { [key: string]: string }) => void) | undefined = classOption.onSubmit
            onClose: AlerHook<T> = classOption.onClose
            onRemove: AlerHook<T> = classOption.onRemove
            result: Promise<[true, Record<string, string>] | [false]>
        }
    }
}