
class LimitError extends Error {
    constructor(msg: string, options?: ErrorOptions) {
        super(msg, options);
    }
}