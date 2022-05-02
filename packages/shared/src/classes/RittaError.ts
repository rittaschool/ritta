import { IErrorType } from "..";

export class RittaError extends Error {
  name = "RittaException";
  type: IErrorType;

  constructor(message: string, type: IErrorType) {
    super(message);
    this.name = "RittaException";
    this.type = type;
  }
}
