import { get } from "./utilities";

export default class OptionsForm {
    form: HTMLFieldSetElement;
    namer: HTMLInputElement;
    options: Set<string>;
    submit: HTMLButtonElement;
    constructor(el: HTMLFieldSetElement) {
        this.form = el;
        const nameInput = get('[data-option-name]', this.form);
        if (!(nameInput instanceof HTMLInputElement)) throw new Error('[data-option-name] is not an input element');
        const optionSubmit = get('[data-action=addOption]', this.form);
        if (!(optionSubmit instanceof HTMLButtonElement)) throw new Error('[data-action=addOption] is not a button element');
        this.namer = nameInput;
        this.options = new Set();
        this.submit = optionSubmit;

        this.submit.addEventListener('click', this.add);
    }
    add = (e: Event) => {
        const name = this.namer.value;
        if (this.options.size === 4)
            return this.error(new LimitError("You've added the maximum of 4 options"));
        if (name === '')
            return this.error(new Error("Please add a label for the option"));
        if (this.options.has(name))
            return this.error(new Error("There is already an option with that name"));

        let template = get('[data-option]');
        if (!(template instanceof HTMLTemplateElement))
            return this.error(new Error('No template element with data-option attribute'));

        template = template.content.firstElementChild;
        if (!(template instanceof HTMLFieldSetElement))
            return this.error(new Error('Child element of the template is not a fieldset element'));

        const newOption = template.cloneNode(true) as HTMLFieldSetElement;
        newOption.name = name;
        const legend = get('legend', newOption) as HTMLLegendElement | null;
        if (!legend)
            return this.error(new Error("Option template has no legend"));
        legend.textContent = name;

        this.options.add(newOption.name);
        this.form.appendChild(newOption);
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
}