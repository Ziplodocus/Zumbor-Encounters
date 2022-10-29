
export default class Notice extends HTMLElement {
    constructor() {
        super();
    }
    notify(str: string) {
        this.textContent = str;
        this.setAttribute('active', '');
        this.removeAttribute('invalid');
        setTimeout(this.clear, 4000);
    }
    error(str: string) {
        this.notify(str);
        this.setAttribute('invalid', '');
    }
    clear = () => {
        this.removeAttribute('active');
        this.removeAttribute('invalid');
    };
}
