import { IFidoDevice, IFidoOptions } from "../interfaces";

export class FidoOptions implements IFidoOptions {
  enabled: boolean;
  devices: IFidoDevice[];

  constructor(enabled: boolean, devices: IFidoDevice[] = []) {
    this.enabled = enabled;
    this.devices = devices;
  }
}
