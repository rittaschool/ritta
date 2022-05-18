import { EducationType, ISocialProvider } from "../../enums";
import { Feature } from "../../enums/features";
import { IContactInfo, ILessonInfo, ILocation } from "../../interfaces";

export class CreateSchoolDto {
  schoolId?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  location?: ILocation;
  principals: IContactInfo[];
  secretaries: IContactInfo[];
  educationTypes: EducationType[];
  allowedAuthMethods: ISocialProvider[];
  features: Feature[];
  lessonInfo?: ILessonInfo;

  constructor(
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
    lessonInfo: ILessonInfo | undefined,
  ) {
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
