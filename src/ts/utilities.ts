import { HTMLInputEl } from "./EncounterForm";

export const get = (sel: string, par: Element | Document = document) => par.querySelector(sel);
export const getAll = (sel: string, par: Element | Document = document) => par.querySelectorAll(sel);

export const debounce = (func: (...args: any[]) => any, time: number) => {
    let timeout: NodeJS.Timeout | undefined;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            return func(...args);
        }, time);
    };
};

export function capitalise(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}

export function setRequiredTrue(element: HTMLInputEl) {
    console.log('Setting required');
    element.setAttribute('required', '');
}
export function setRequiredFalse(element: HTMLInputEl) {
    console.log('Setting not required');
    element.removeAttribute('required');
}