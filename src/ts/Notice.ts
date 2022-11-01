import { debounce } from './utilities';

export default class Notice extends HTMLElement {
    constructor() {
        super();
    }
    notify(str: string) {
        this.textContent = str;
        this.setAttribute('active', '');
        this.removeAttribute('invalid');
        this.clear();
    }
    error(str: string) {
        this.notify(str);
        this.setAttribute('invalid', '');
    }
    clear = debounce(() => {
        this.removeAttribute('active');
        this.removeAttribute('invalid');
    }, 4000);
}
