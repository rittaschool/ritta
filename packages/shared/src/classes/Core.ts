import { ISocialProvider } from "../enums/auth";
import { EducationType } from "../enums/core";
import { Feature, InstanceFeature } from "../enums/features";
import { IContactInfo, IInstance, ILessonInfo, ILocation, ISchool } from "../interfaces";

export class Instance implements IInstance {
  id: string;
  name: string;
  contact?: IContactInfo | undefined;
  schools: ISchool[];
  features: InstanceFeature[];

  constructor(id: string, name: string, contact: IContactInfo | undefined, schools: ISchool[], features: InstanceFeature[]) {
    this.id = id;
    this.name = name;
    this.contact = contact;
    this.schools = schools;
    this.features = features;
  }  
}

export class School implements ISchool {
  id: string;
  schoolId?: string | undefined;
  name: string;
  email?: string | undefined;
  phoneNumber?: string | undefined;
  location?: ILocation | undefined;
  principals: IContactInfo[];
  secretaries: IContactInfo[];
  educationTypes: EducationType[];
  allowedAuthMethods: ISocialProvider[];
  features: Feature[];
  lessonInfo?: ILessonInfo | undefined;
  
  constructor(
    id: string,
    schoolId: string | undefined,
    name: string,
    email: string | undefined,
    phoneNumber: string | undefined,
    location: ILocation | undefined,
    principals: IContactInfo[],
    secretaries: IContactInfo[],
    educationTypes: EducationType[],
    allowedAuthMethods: ISocialProvider[],
    features: Feature[],
    lessonInfo: ILessonInfo | undefined
  ) {
    this.id = id;
    this.schoolId = schoolId;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.location = location;
    this.principals = principals;
    this.secretaries = secretaries;
    this.educationTypes = educationTypes;
    this.allowedAuthMethods = allowedAuthMethods;
    this.features = features;
    this.lessonInfo = lessonInfo;
  }
}
