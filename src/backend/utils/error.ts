export default class OperationError extends Error {
  code: number;
  name: string;
  constructor(code = 0, msg: string) {
    super(msg);
    this.code = code;
    this.name = msg;
    Object.setPrototypeOf(this, OperationError.prototype);
  }
}
