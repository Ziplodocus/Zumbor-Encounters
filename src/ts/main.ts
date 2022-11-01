import { get, getAll } from './utilities';
import EncounterForm from './EncounterForm';
import Notice from './Notice';

customElements.define('notice-strip', Notice);

const noticeBoard = get('notice-strip') as Notice;

getAll('[data-encounter-form]').forEach(el => {
    if (!(el instanceof HTMLFormElement)) return console.error(el, 'Not a form element');

    const { form, options } = new EncounterForm(get('[data-submit]') as HTMLButtonElement, el);
    //@ts-ignore TS doesn't recognise custom events.
    form.addEventListener('err', (e: CustomEvent<Error>) => {
        noticeBoard.error(e.detail.message);
    });
    //@ts-ignore TS doesn't recognise custom events.
    form.addEventListener('notice', (e: CustomEvent<string>) => {
        noticeBoard.notify(e.detail);
    });

    options.add();
    options.namer.value = 'bumble';
    options.add();
});
