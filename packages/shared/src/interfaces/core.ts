import { EducationType, ISocialProvider } from "../enums";
import { Feature, InstanceFeature } from "../enums/features";
import { ILocation } from "./users";

/** Instance = Tenant */
export interface IInstance {
  id: string;
  name: string;
  contact?: IContactInfo;
  schools: ISchool[];
  features: InstanceFeature[];
}

export interface ISchool {
  id: string;
  schoolId: string; // KOSKI-tietojärjestelmän oppilaitosnumero
  name: string;
  email?: string;
  phoneNumber?: string;
  location?: ILocation;
  principals: IContactInfo[];
  secretaries: IContactInfo[];
  educationTypes: EducationType[];
  featuresEnabled: Feature[];
  allowedAuthMethods: ISocialProvider[];
  features: Feature[];
  lessonInfo?: ILessonInfo;
}

export interface IContactInfo {
  name: string;
  title?: string;
  phoneNumber?: string;
  email?: string;
}

export interface ILessonInfo {
  length: number; // Normal length of a lesson in minutes
  lessonTimes: ILessonTime[];
}

export interface ILessonTime {
  start: string; // 00:00 -> midnight 12:00 -> noon 13:00 -> 1pm, etc
  end: string;
}