export default class UserService {
    static createUser(username: string, firstName: string, lastName: string, password: string): Promise<any>;
    static createAccount(firstName: string, lastName: string, userType?: number): Promise<any>;
    static createTeacher(firstName: string, lastName: string, titles?: [string]): Promise<any>;
    static createStudent(firstName: string, lastName: string): Promise<any>;
}
