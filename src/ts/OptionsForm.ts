import { get, getAll, setRequiredFalse, setRequiredTrue } from "./utilities";
import { EffectKey, Attribute, LingeringEffectKey, LingeringEffectType } from "@ziplodocus/zumbor-types";
import { HTMLInputEl } from "./EncounterForm";

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
        this.initBaseEffects();
        this.initAdditionalEffects();

        this.namer.addEventListener(
            'keyup',
            (e) => {
                if (e.key !== 'Enter') return;
                e.preventDefault();
                this.add();
            }
        );
        this.submit.addEventListener('click', this.add);
    }

    private initStats() {
        const statInput = get('[name=stat]', this.template);
        if (!(statInput instanceof HTMLSelectElement))
            throw new Error('[name=stat] is not a select element');
        for (const attr of Object.values(Attribute)) {
            const option = document.createElement('option');
            option.value = attr;
            option.innerText = attr;
            statInput.appendChild(option);
        }
    }

    private initBaseEffects() {
        const effectGroups = getAll('fieldset[name=baseEffect]', this.template);
        effectGroups.forEach(effectGroup => {
            const nameInput = get("select[name=name]", effectGroup) as HTMLSelectElement;
            const inputs = getAll("[name]", effectGroup) as NodeListOf<HTMLInputEl>;
            if (!nameInput) throw new Error('No name input in baseEffect fieldset');
            for (const effect of Object.values(EffectKey)) {
                const option = document.createElement('option');
                option.value = effect;
                option.innerText = effect;
                nameInput.appendChild(option);
            }
        });


    }

    private initAdditionalEffects() {
        const effectGroups = getAll('fieldset[name=additionalEffect]', this.template);
        effectGroups.forEach(effectGroup => {
            const nameInput = get("select[name=name]", effectGroup);
            if (!nameInput) throw new Error('No name input in baseEffect fieldset');
            for (const effect of Object.values(LingeringEffectKey)) {
                const option = document.createElement('option');
                option.value = effect;
                option.innerText = effect;
                nameInput.appendChild(option);
            }

            const typeInput = get("select[name=type]", effectGroup);
            if (!typeInput) throw new Error('No type input in baseEffect fieldset');
            for (const effect of Object.values(LingeringEffectType)) {
                const option = document.createElement('option');
                option.value = effect;
                option.innerText = effect;
                typeInput.appendChild(option);
            }
        });
    }

    private add = () => {
        if (!this.namer.checkValidity())
            return this.error(new Error("Please add a label for the option"));
        const name = this.namer.value;
        if (this.options.size === 4)
            return this.error(new Error("You've added the maximum of 4 options"));
        if (this.options.has(name))
            return this.error(new Error("There is already an option with that name"));

        const newOption = this.template.cloneNode(true) as HTMLFieldSetElement;
        newOption.name = name;
        const legend = get('legend span', newOption) as HTMLLegendElement | null;
        if (!legend)
            return this.error(new Error("Option template has no legend"));
        legend.textContent = name;

        this.options.add(newOption.name);
        this.form.appendChild(newOption);
        this.namer.value = '';
        get('[data-action=removeOption]', newOption)?.addEventListener('click', () => {
            this.form.removeChild(newOption);
            this.options.delete(name);
            this.notice(`Removed ${name} option`);
        });

        const nameInputs = getAll('select[name=name]', newOption) as NodeListOf<HTMLSelectElement>;
        nameInputs.forEach(nameInput => {
            const fieldSet = nameInput.closest('fieldset') as HTMLFieldSetElement;
            const inputs = getAll('[name]', fieldSet) as NodeListOf<HTMLInputEl>;
            nameInput.addEventListener('input', () => {
                if (nameInput.value !== '') inputs.forEach(setRequiredTrue);
                else inputs.forEach(setRequiredFalse);
            })
        })

        this.notice(`Added ${name} option`);
    };

    reset = () => {
        getAll('fieldset[data-option]', this.form).forEach(option => option.remove());
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
        let template = get(':scope [data-option-template]', this.form);
        if (!(template instanceof HTMLTemplateElement))
            throw new Error('No template element with data-option-template attribute');
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