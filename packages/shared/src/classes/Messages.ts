import { IRecipientType } from "../enums";
import { IMessage, IThread } from "../interfaces";

export class Message implements IMessage {
  id: string;
  senderId: string;
  created: number;
  content: string;
  seenBy: string[];
  removed: boolean;
  
  constructor(id: string, senderId: string, created: number, content: string, seenBy: string[], removed: boolean) {
    this.id = id;
    this.senderId = senderId;
    this.created = created;
    this.content = content;
    this.seenBy = seenBy;
    this.removed = removed;
  }
}

export class Thread implements IThread {
  id: string;
  name: string;
  sender: { id: string; archived: boolean; };
  removed: boolean;
  showNames: boolean;
  canReply: boolean;
  draft: boolean;
  recipients: { type: IRecipientType, id: string; archived?: boolean | undefined; }[];
  messages: Message[];
  created: number;
  

  constructor(id: string, name: string, sender: { id: string; archived: boolean; }, removed: boolean, showNames: boolean, canReply: boolean, draft: boolean, recipients: { type: IRecipientType, id: string, archived?: boolean | undefined; }[], messages: Message[], created: number) {
    this.id = id;
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
