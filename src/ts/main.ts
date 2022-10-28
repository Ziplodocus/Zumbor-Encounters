import { get, getAll } from './utilities';
import EncounterForm from './EncounterForm';

getAll('[data-encounter-form]').forEach(el => {
    if (el instanceof HTMLFormElement) new EncounterForm(el);
    else console.error(el, 'Not a form element');
});

