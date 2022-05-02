import { ILocation } from "../interfaces";

export class Location implements ILocation {
  address: string;
  city: string;
  country: string;
  zip: string;

  constructor(address: string, city: string, country: string, zip: string) {
    this.address = address;
    this.city = city;
    this.country = country;
    this.zip = zip;
  }
}
