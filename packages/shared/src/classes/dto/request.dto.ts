export class RequestDto<X> {
  rid: string;
  token: string;
  data?: X;

  constructor(rid: string, token: string, data: X | undefined) {
    this.rid = rid;
    this.token = token;
    this.data = data;
  }
}
