import { IMessage, IThread } from "../interfaces";

export class Message implements IMessage {
  senderId: string;
  created: number;
  content: string;
  seenBy: string[];
  
  constructor(senderId: string, created: number, content: string, seenBy: string[]) {
    this.senderId = senderId;
    this.created = created;
    this.content = content;
    this.seenBy = seenBy;
  }
}

export class Thread implements IThread {
  name: string;
  sender: { userId: string; archived: boolean; };
  removed: boolean;
  showNames: boolean;
  canReply: boolean;
  draft: boolean;
  recipients: { userId: string; archived?: boolean | undefined; }[];
  messages: Message[];
  created: number;
  

  constructor(name: string, sender: { userId: string; archived: boolean; }, removed: boolean, showNames: boolean, canReply: boolean, draft: boolean, recipients: { userId: string, archived?: boolean | undefined; }[], messages: Message[], created: number) {
    this.name = name;
    this.sender = sender;
    this.removed = removed;
    this.showNames = showNames;
    this.canReply = canReply;
    this.draft = draft;
    this.recipients = recipients;
    this.messages = messages;
    this.created = created;
  }
  
}
