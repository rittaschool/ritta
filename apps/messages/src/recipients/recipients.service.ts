import { Injectable, Inject } from '@nestjs/common';
import {
  IMessageRecipientStaff,
  IMessageRecipientTeacher,
} from '@rittaschool/shared';
import { UserService } from 'src/services/user.service';

@Injectable()
export class RecipientsService {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly userService: UserService,
  ) {}

  async listRecipients(): Promise<{
    teachers: IMessageRecipientTeacher[];
    staff: IMessageRecipientStaff[];
  }> {
    const recipientsAvailable = await this.userService.findAll();
    // TODO: add better filtering after role data implementation
    // TODO: add real data
    // TODO: add per role recipients (students, parents => show teachers, teachers => show parents, students and other teachers)
    return {
      teachers: [
        {
          id: 'test',
          name: 'Pekka Puupää',
          subjects: ['käsityö'],
        },
        {
          id: 'test',
          name: 'Minna Matemaatikko',
          subjects: ['matematiikka'],
        },
        {
          id: 'test',
          name: 'Hyvä Äikäs',
          subjects: ['äidinkieli ja kirjallisuus'],
        },
        {
          id: 'test',
          name: 'Ville Vossiili',
          subjects: ['historia'],
        },
      ],
      staff: [
        {
          id: 'test',
          name: 'Olli Opeava',
          role: 'koulunkäynninohjaaja',
        },
        ...recipientsAvailable.map((r) => ({
          id: r.id,
          name: `${r.firstName} ${r.lastName}`,
          role: 'Testikäyttäjä',
        })),
      ],
    };
  }
}
