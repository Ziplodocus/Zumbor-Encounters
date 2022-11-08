import { get, getAll } from './utilities';
import OptionsForm from './OptionsForm';
import { validateEncounterData } from '@ziplodocus/zumbor-types';
import sanitize from 'sanitize-filename';

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
            if (!field.checkValidity()) return new Error(`The ${field.name} field is invalid...`);
            encounter[field.name] = (field instanceof HTMLFieldSetElement) ? this.jsonify(field) : (field.type === 'number' ? +field.value : field.value);
            // @ts-ignore encounter[field.name] is literally defined the line above
            if (field.name === 'success' || field.name === 'fail') encounter[field.name]['type'] = field.name;
        };
        return encounter;
    };

    private submit = async () => {
        let data = this.jsonify();
        console.log(data);
        if (data instanceof Error) return this.error(data);

        const validData = validateEncounterData(data);
        if (validData instanceof Error) return this.error(validData);

        // Ensure safe filename
        const filename = sanitize(validData.title);
        this.form.dispatchEvent(new CustomEvent('zubmit', { detail: { filename, data: validData } }));
    };
}
