import { get, getAll } from './utilities';
import OptionsForm from './OptionsForm';
import { validateEncounterData } from '@ziplodocus/zumbor-types';

type HTMLInputEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export default class EncounterForm {
    form: HTMLFormElement;
    options: OptionsForm;
    wrap: HTMLFieldSetElement;
    constructor(submit: HTMLButtonElement, form: HTMLFormElement) {
        this.form = form;
        this.wrap = get('fieldset', form) as HTMLFieldSetElement;

        let options = get('[name=options]', form);
        if (!(options instanceof HTMLFieldSetElement)) throw new Error('[name=options] is not a fieldset element');
        this.options = new OptionsForm(options);

        submit.addEventListener('click', this.submit);

        //@ts-ignore TS doesn't recognise custom events.
        this.options.form.addEventListener('err', (e: CustomEvent) => this.error(e.detail));
        //@ts-ignore TS doesn't recognise custom events.
        this.options.form.addEventListener('notice', (e: CustomEvent) => this.notice(e.detail));
    }
    private error = (err: Error) => {
        this.form.dispatchEvent(
            new CustomEvent('err', { detail: err }));
    };
    private notice = (msg: string) => {
        this.form.dispatchEvent(
            new CustomEvent('notice', { detail: msg })
        );
    };
    private jsonify = (element: HTMLFieldSetElement = this.wrap): Record<string, unknown> | Error => {
        let encounter: Record<string, unknown> = {};
        const fields = getAll(':scope > label [name], :scope > fieldset', element) as NodeListOf<HTMLInputEl | HTMLFieldSetElement>;
        for (const field of Array.from(fields)) {
            if (!field.checkValidity()) return new Error('Some fields are invalid...');
            encounter[field.name] = (field instanceof HTMLFieldSetElement) ? this.jsonify(field) : field.value;
        };
        return encounter;
    };

    private submit = () => {
        const data = this.jsonify();
        if (data instanceof Error) return this.error(data);
        const validatedData = validateEncounterData(data);
        if (validatedData instanceof Error) return this.error(validatedData);
        console.log(validatedData);
        this.form.dispatchEvent(new CustomEvent('submit', { detail: validatedData }));
    };
}
