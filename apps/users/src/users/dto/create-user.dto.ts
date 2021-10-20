import { ILocation, IOAuth2Identifiers } from 'shared';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
  email?: string;
  alias?: string;
  home?: ILocation;
  oauth2Identifiers?: IOAuth2Identifiers;
}
