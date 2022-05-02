import { IAccountType } from '../enums';

export interface IParentSchema {
  type: IAccountType.PARENT;
  workNumber?: string;
}

export interface IStudentSchema {
  type: IAccountType.STUDENT;
}

export interface ITeacherSchema {
  type: IAccountType.TEACHER;
  titles: string[];
  abbreviation: string;

  generateAbbreviation: (firstName: string, lastName: string) => string;
}
