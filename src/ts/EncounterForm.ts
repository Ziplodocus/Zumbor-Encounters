import { get, getAll } from './utilities';
import OptionsForm from './OptionsForm';

export default class EncounterForm {
    form: HTMLFormElement;
    options: OptionsForm;
    constructor(form: HTMLFormElement) {
        this.form = form;

        let options = get('[name=options]', form);
        if (!(options instanceof HTMLFieldSetElement)) throw new Error('[name=options] is not a fieldset element');
        this.options = new OptionsForm(options);

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
}