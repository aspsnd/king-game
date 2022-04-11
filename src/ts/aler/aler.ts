import { AlerFactory } from './core';
import AlerHTML from "./templete/aler.html?raw";
import SingleAlerHTML from "./templete/single.html?raw";
import InputerHTML from "./templete/inputer.html?raw";
import TipHTML from "./templete/tip.html?raw";
import LoadingHTML from "./templete/loading.html?raw";
import SelectorHTML from "./templete/select.html?raw";

const AlerModel = document.createElement('div');
AlerModel.innerHTML = AlerHTML;
export const Aler = AlerFactory.create({
    model: AlerModel,
    cover: 'ax-cover',
    baseAlerOption: {
        title: '黑白猫猫网',
        content: '',
        submit: '确认',
        cancel: '取消',
    },
})

const SingleAlerModel = document.createElement('div');
SingleAlerModel.innerHTML = SingleAlerHTML;

export const SingleAler = AlerFactory.create({
    model: SingleAlerModel,
    cover: 'ax-cover',
    baseAlerOption: {
        content: '',
        submit: '确认',
    }
})

const InputerModel = document.createElement('div');
InputerModel.innerHTML = InputerHTML;

export const Inputer = AlerFactory.create({
    model: InputerModel,
    cover: 'ax-cover',
    baseAlerOption: {
        title: '请输入',
        type: 'input',
        default: '',
        submit: '确认',
        cancel: '取消',
    },
    onCreate() {
        this.node.querySelector(this.option.type === 'input' ? 'textarea' : 'input')?.remove();
        this.node.querySelector(this.option.type === 'textarea' ? 'textarea' : 'input')!.value = this.option.default;
    },
})

const TipModel = document.createElement('div');
TipModel.innerHTML = TipHTML;

export const Tip = AlerFactory.create({
    model: SingleAlerModel,
    cover: 'ax-cover',
    baseAlerOption: {
        content: '',
        time: 1000,
        autoClose: true
    },
    onCreate() {
        this.option.autoClose && setTimeout(() => {
            this.remove();
        }, this.option.time);
    }
})

const LoadingModel = document.createElement('div');
LoadingModel.innerHTML = LoadingHTML;
export const Loading = AlerFactory.create({
    model: LoadingModel,
    cover: 'ax-cover',
    baseAlerOption: {}
})

const SelectorModel = document.createElement('div');
SelectorModel.innerHTML = SelectorHTML;
export const Selector = AlerFactory.create({
    model: SelectorModel,
    cover: 'ax-cover',
    baseAlerOption: {
        options: []
    },
    onCreate() {
        let options = this.option.options as string[];
        let node = this.node.querySelector('div')!;
        this.node.setAttribute('cancel', '');
        node.onclick = e => {
            let target = e.target as HTMLDivElement;
            if (!target.classList.contains('opt')) return;
            let form = {
                value: target.innerText,
                //@ts-ignore
                index: target._index
            };
            this.submitedForm = form;
            this.onSubmit?.(form);
            this.remove();
        }
        options.forEach((opt, index) => {
            let opter = document.createElement('div');
            opter.className = 'opt';
            opter.innerText = opt;
            //@ts-ignore
            opter._index = index;
            node.appendChild(opter);
        })
    }
})