export class ClickMeException extends Error {
  public message: string;
  public status?: number;

  public constructor(message: string, status?: number) {
    super(message);
    this.message = message;
    this.status = status;
    Object.setPrototypeOf(this, ClickMeException.prototype);
  }
}
