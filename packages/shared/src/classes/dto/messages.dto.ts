import { IRecipientType, IThreadFolders } from "../..";

export class NewThreadDto {
  title: string;
  content: string;
  showNames: boolean;
  canReply: boolean;
  draft: boolean;
  recipients: { type: IRecipientType; id: string; }[];

  constructor(
    title: string,
    content: string,
    showNames: boolean,
    canReply: boolean,
    draft: boolean,
    recipients: { type: IRecipientType; id: string; }[]
  ) {
    this.title = title;
    this.content = content;
    this.showNames = showNames;
    this.canReply = canReply;
    this.draft = draft;
    this.recipients = recipients;
  }
}

export class GetThreadsDto {
  folder?: IThreadFolders;

  constructor(
    folder?: IThreadFolders
  ) {
    this.folder = folder;
  }
}

export class NewMessageDto {
  threadId: string;
  content: string;

  constructor(
    threadId: string,
    content: string,
  ) {
    this.threadId = threadId;
    this.content = content;
  }
}

export class EditMessageDto {
  messageId: string;
  newContent: string;

  constructor(
    messageId: string,
    newContent: string
  ) {
    this.messageId = messageId;
    this.newContent = newContent;
  }
}
export class DeleteMessageDto {
  threadId: string;
  messageId: string;

  constructor(
    threadId: string,
    messageId: string
  ) {
    this.threadId = threadId;
    this.messageId = messageId;
  }
}

export class DeleteThreadDto {
  threadId: string;
  
  constructor(
    threadId: string
  ) {
    this.threadId = threadId;
  }
}

export class ArchiveThreadDto {
  threadId: string;
  
  constructor(
    threadId: string
  ) {
    this.threadId = threadId;
  }
}

export class MarkThreadAsReadDto {
  threadId: string;
  
  constructor(
    threadId: string
  ) {
    this.threadId = threadId;
  }
}

export class MarkThreadAsUnreadDto {
  threadId: string;
  
  constructor(
    threadId: string
  ) {
    this.threadId = threadId;
  }
}