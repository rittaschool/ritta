export interface IMessage {
  senderId: string;
  created: number;
  content: string;
  seenBy: string[]; // uid[]
}

export interface IThread {
  name: string;
  sender: {
    userId: string;
    archived: boolean; // Has the sender archived the thread?
  };
  removed: boolean; // Is the thread removed (this can be done if nobody has replied to the thread).
  showNames: boolean; // Is viewing other recipients names allowed?
  canReply: boolean; // If this is false, replying will create a new thread
  draft: boolean;
  recipients: {
    userId: string;
    archived?: boolean; // This value are only available for the thread sender or if the recipient is the client.
  }[];
  messages: IMessage[];
  created: number; // Timestamp
}

export interface IAnnouncement {
  name: string;
  senderId: string;
  content: string;
  public: boolean; // Visible on login page
  forTeachers: boolean;
  forStaff: boolean;
  forStudents: boolean;
  forParents: boolean;
  school?: string[]; // Restrict announcement for specific school ids
  created: number;
}