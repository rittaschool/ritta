import { IAnnouncement } from "../interfaces";

export class Announcement implements IAnnouncement {
  id: string;
  name: string;
  senderId: string;
  content: string;
  public: boolean;
  forTeachers: boolean;
  forStaff: boolean;
  forStudents: boolean;
  forParents: boolean;
  school?: string[] | undefined;
  created: number;
  
  constructor(id: string, name: string, senderId: string, content: string, isPublic: boolean, forTeachers: boolean, forStaff: boolean, forStudents: boolean, forParents: boolean, school: string[] | undefined, created: number) {
    this.id = id;
    this.name = name;
    this.senderId = senderId;
    this.content = content;
    this.public = isPublic;
    this.forTeachers = forTeachers;
    this.forStaff = forStaff;
    this.forStudents = forStudents;
    this.forParents = forParents;
    this.school = school;
    this.created = created;
  }
}
