import { InstanceFeature } from "../../enums/features";
import { IContactInfo } from "../../interfaces";

export class CreateInstanceDto {
  name: string;
  contact: IContactInfo;
  features: InstanceFeature[];

  constructor(
    name: string,
    contact: IContactInfo,
    features: InstanceFeature[],
  ) {
    this.name = name;
    this.contact = contact;
    this.features = features;
  }
}
