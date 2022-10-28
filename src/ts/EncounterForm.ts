import { get, getAll } from './utilities';

export default class EncounterForm {
    form: HTMLFormElement;
    options: HTMLFieldSetElement;
    optionCount: number;
    optionNamer: HTMLInputElement;
    constructor(form: HTMLFormElement) {
        this.form = form;

        let options = get('[name=options]', form);
        if (!(options instanceof HTMLFieldSetElement)) throw new Error('[name=options] is not a fieldset element');
        this.options = options;
        this.optionCount = 0;

        const nameInput = get('[data-option-name]', this.form);
        if (!(nameInput instanceof HTMLInputElement)) throw new Error('[data-option-name] is not an input element');
        this.optionNamer = nameInput;

        getAll('[data-action]', form).forEach(el => {
            if (!(el instanceof HTMLElement)) return;
            const action = el.dataset?.action;
            if (!action || !(action in this)) return;
            const handler = this[action as keyof this];
            if (typeof handler !== 'function') return;
            el.addEventListener('click', handler as unknown as () => any);
        });
    }
    addOption = (e: Event) => {
        if (this.optionCount === 4) return new Error("There's a max of 4 options.");
        if (this.optionNamer.value === '') return new Error("An option must have a label!");

        let optionTemplate = get('[data-option]');
        if (!(optionTemplate instanceof HTMLTemplateElement)) throw new Error('No template element with data-option attribute');
        optionTemplate = optionTemplate.content.firstElementChild;
        if (!(optionTemplate instanceof HTMLFieldSetElement)) throw new Error('Child element of the template is not a fieldset element');

        const newOption = optionTemplate.cloneNode(true) as HTMLFieldSetElement;
        newOption.name = this.optionNamer.value;
        const legend = get('legend', newOption) as HTMLLegendElement | null;
        if (!legend) throw new Error("Option template has no legend");
        legend.textContent = this.optionNamer.value;

        this.options.appendChild(newOption);
        this.optionCount++;
        if (
            e.currentTarget instanceof HTMLButtonElement
            && this.optionCount === 4
        )
            e.currentTarget.disabled = true;
        return true;
    };
}