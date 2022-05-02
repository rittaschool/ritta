import { ISocialProvider } from '../enums';

export type IOAuth2Identifiers = {
  [key in ISocialProvider]?: string;
};
