
export const get = (sel: string, par: Element | Document = document) => par.querySelector(sel);
export const getAll = (sel: string, par: Element | Document = document) => par.querySelectorAll(sel);