import { IRecipientType } from '@rittaschool/shared';
import { Message } from '@rittaschool/shared';
import { IsUUID } from 'class-validator';

export class UpdateThreadDto {
  @IsUUID('4')
  id?: string;

  draft?: boolean;
  recipients?: {
    type: IRecipientType;
    id: string;
    archived?: boolean | undefined;
  }[];
  messages?: Message[];
  removed?: boolean;
}
