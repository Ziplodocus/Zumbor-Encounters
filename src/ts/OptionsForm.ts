import { capitalise, get, getAll } from "./utilities";
import { PlayerEffect, Attribute } from "@ziplodocus/zumbor-types";

export default class OptionsForm {
    form: HTMLFieldSetElement;
    namer: HTMLInputElement;
    options: Set<string>;
    submit: HTMLButtonElement;
    template: HTMLFieldSetElement;
    constructor(el: HTMLFieldSetElement) {
        this.form = el;
        this.template = this.getTemplate();
        this.namer = this.getNamer();
        this.options = new Set();
        this.submit = this.getSubmit();
        this.initStats();
        this.initEffects();

        this.namer.addEventListener(
            'keyup',
            (e) => e.key === 'Enter' && this.add()
        );
        this.submit.addEventListener('click', this.add);
    }

    private initStats() {
        const statInput = get('[name=stat]', this.template);
        if (!(statInput instanceof HTMLSelectElement))
            throw new Error('[name=stat] is not a select element');
        for (const [key, attr] of Object.entries(Attribute)) {
            const option = document.createElement('option');
            option.value = attr;
            option.innerText = key;
            statInput.appendChild(option);
        }
    }
    private initEffects() {
        const effectInput = getAll('select[name=effect]', this.template);
        if (effectInput.length !== 2)
            throw new Error('Missing two select[name=effect]');
        effectInput.forEach(sel => {
            for (const [key, val] of Object.entries(PlayerEffect)) {
                const option = document.createElement('option');
                option.value = key;
                option.innerText = capitalise(val);
                sel.appendChild(option);
            }
        });
    }

    add = () => {
        if (!this.namer.checkValidity())
            return this.error(new Error("Please add a label for the option"));
        const name = this.namer.value;
        if (this.options.size === 4)
            return this.error(new Error("You've added the maximum of 4 options"));
        if (this.options.has(name))
            return this.error(new Error("There is already an option with that name"));

        const newOption = this.template.cloneNode(true) as HTMLFieldSetElement;
        newOption.name = name;
        const legend = get('legend', newOption) as HTMLLegendElement | null;
        if (!legend)
            return this.error(new Error("Option template has no legend"));
        legend.textContent = name;

        this.options.add(newOption.name);
        this.form.appendChild(newOption);
        this.namer.value = '';
        if (this.options.size !== 4) return this.notice(`Added ${name} option`);
    };

    private error = (err: Error) => {
        this.form.dispatchEvent(
            new CustomEvent('err', { detail: err }));
    };
    private notice = (msg: string) => {
        this.form.dispatchEvent(
            new CustomEvent('notice', { detail: msg })
        );
    };

    private getTemplate() {
        let template = get(':scope [data-option]', this.form);
        if (!(template instanceof HTMLTemplateElement))
            throw new Error('No template element with data-option attribute');
        template = template.content.firstElementChild;
        if (!(template instanceof HTMLFieldSetElement))
            throw new Error('Child element of the template is not a fieldset element');
        return template;
    }
    private getNamer() {
        const nameInput = get('[data-option-name]', this.form);
        if (!(nameInput instanceof HTMLInputElement)) throw new Error('[data-option-name] is not an input element');
        return nameInput;
    }
    private getSubmit() {
        const optionSubmit = get('[data-action=addOption]', this.form);
        if (!(optionSubmit instanceof HTMLButtonElement)) throw new Error('[data-action=addOption] is not a button element');
        return optionSubmit;
    }
}