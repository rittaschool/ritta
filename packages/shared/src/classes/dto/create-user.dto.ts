import { Location } from "../Location";
import { Oauth2Identifiers } from "../Oauth2Identifiers";

export class CreateUserDto {
  firstName: string;
  lastName: string;
  password: string;
  email?: string;
  alias?: string;
  home?: Location;
  oauth2Identifiers?: Oauth2Identifiers;
  phoneNumber?: string;
  username?: string;

  constructor(
    firstName: string,
    lastName: string,
    password: string,
    email?: string,
    alias?: string,
    home?: Location,
    oauth2Identifiers?: Oauth2Identifiers,
    phoneNumber?: string,
    username?: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.email = email;
    this.alias = alias;
    this.home = home;
    this.oauth2Identifiers = oauth2Identifiers;
    this.phoneNumber = phoneNumber;
    this.username = username;
  }
}
