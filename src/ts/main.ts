import { get } from './utilities';
import EncounterForm from './EncounterForm';
import Notice from './Notice';
import * as Storage from './Storage';

customElements.define('notice-strip', Notice);
const notice = get('notice-strip') as Notice;
const keyInput = get('[data-auth-token]') as HTMLInputElement;

const form = get('form[data-encounter-form]') as HTMLFormElement;
new EncounterForm(get('[data-submit]') as HTMLButtonElement, form);

//@ts-ignore TS doesn't recognise custom events.
form.addEventListener('err', (e: CustomEvent<Error>) => {
    notice.error(e.detail.message);
});
//@ts-ignore TS doesn't recognise custom events.
form.addEventListener('notice', (e: CustomEvent<string>) => {
    notice.notify(e.detail);
});

form.addEventListener('zubmit', async (e) => {
    //@ts-ignore TS doesn't recognise custom events.
    const { filename, data } = e.detail;
    const key = keyInput.value;

    // Check if file exists
    const fileExists = await Storage.exists(filename, key);
    if (fileExists === true) return notice.error(`Encounter ${data.title} already exists!`);
    else if (fileExists instanceof Error) return notice.error(fileExists.message);

    const uploadResult = await Storage.upload(filename, data, key);
    if (uploadResult instanceof Error) {
        notice.error(uploadResult.message);
    }

    notice.notify(`Encounter ${data.title} has been added`);
});
