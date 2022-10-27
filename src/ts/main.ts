import { Attribute } from '@ziplodocus/zumbor-types';

const get = (sel: string, par: Element | Document = document) => par.querySelector(sel);
const getAll = (sel: string, par = document) => par.querySelectorAll(sel);

(() => {
    let optionTemplate = get('[data-option]');
    if (!(optionTemplate instanceof HTMLTemplateElement)) return;
    optionTemplate = optionTemplate.content.firstElementChild;
    if (!(optionTemplate instanceof HTMLFieldSetElement)) return;

    const options = get('[name=options]');
    if (!options) return;

    const addOption = () => {
        if (!(optionTemplate instanceof HTMLFieldSetElement)) return;
        const nameInput = get('[data-option-name]', options);
        if (!(nameInput instanceof HTMLInputElement)) return;
        const newOption = optionTemplate.cloneNode(true) as HTMLFieldSetElement;
        newOption.name = nameInput.value;

        options.appendChild(newOption);
    };

    const formActions = {
        addOption
    };

    getAll('[data-action]').forEach(
        el => el.addEventListener(
            'click',
            formActions[el.dataset['action']]
        )
    );
})();
