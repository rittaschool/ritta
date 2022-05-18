import { IsUUID } from 'class-validator';

export class DeleteWithIdDto {
  @IsUUID('4')
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
