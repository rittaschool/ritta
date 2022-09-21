import { IRecipientType, IThreadFolders } from "../..";

export class NewThreadDto {
  name: string;
  content: string;
  showNames: boolean;
  canReply: boolean;
  draft: boolean;
  recipients: { type: IRecipientType; id: string }[];

  constructor(
    name: string,
    content: string,
    showNames: boolean,
    canReply: boolean,
    draft: boolean,
    recipients: { type: IRecipientType; id: string }[]
  ) {
    this.name = name;
    this.content = content;
    this.showNames = showNames;
    this.canReply = canReply;
    this.draft = draft;
    this.recipients = recipients;
  }
}

export class GetThreadsDto {
  folder?: IThreadFolders;

  constructor(folder?: IThreadFolders) {
    this.folder = folder;
  }
}

export class NewMessageDto {
  threadId: string;
  content: string;
  senderId?: string;
  seenBy?: string[];

  constructor(
    threadId: string,
    content: string,
    senderId?: string,
    seenBy?: string[]
  ) {
    this.threadId = threadId;
    this.content = content;
    this.senderId = senderId;
    this.seenBy = seenBy;
  }
}

export class EditMessageDto {
  messageId: string;
  newContent: string;

  constructor(messageId: string, newContent: string) {
    this.messageId = messageId;
    this.newContent = newContent;
  }
}
export class DeleteMessageDto {
  threadId: string;
  messageId: string;

  constructor(threadId: string, messageId: string) {
    this.threadId = threadId;
    this.messageId = messageId;
  }
}

export class ThreadActionDto {
  threadId: string;

  constructor(threadId: string) {
    this.threadId = threadId;
  }
}

export class SearchRecipientsDto {
  query: string;

  constructor(query: string) {
    this.query = query;
  }
}
