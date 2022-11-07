import { get, getAll } from './utilities';
import EncounterForm from './EncounterForm';
import Notice from './Notice';
import * as Storage from './Storage';

customElements.define('notice-strip', Notice);
const noticeBoard = get('notice-strip') as Notice;
const keyInput = get('[data-auth-token]') as HTMLInputElement;

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

    form.addEventListener('zubmit', async (e) => {
        //@ts-ignore TS doesn't recognise custom events.
        const { filename, data: data } = e.detail;
        const key = keyInput.value;

        // Check if file exists
        const fileExists = await Storage.exists(filename, key);
        if (fileExists === true) return noticeBoard.error(`Encounter ${data.title} already exists!`);
        else if (fileExists instanceof Error) return noticeBoard.error(fileExists.message);

        const uploadResult = await Storage.upload(filename, data, key);
        if (uploadResult instanceof Error) {
            noticeBoard.error(uploadResult.message);
        }

        noticeBoard.notify(`Encounter ${data.title} has been added`);
    });
});
