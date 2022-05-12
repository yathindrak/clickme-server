export class ClickMeException {
    public code: string;
    public name: string;
    public message: string;

    public constructor(code: string, name: string, message: string) {
        this.code = code;
        this.name = name;
        this.message = message;
    }
}