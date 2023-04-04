// tickets
export enum TicketStates {
  OPEN = "open",
  IN_PROGRESS = "in-progress",
  CODE_REVIEW = "code-review",
  DONE = "done",
}

export interface ITicket {
  id: string;
  createdAt: string;
  description: string;
  title: string;
  currentState: TicketStates;
}

export interface INewTicket {
  createdAt: string;
  description: string;
  title: string;
  currentState: TicketStates;
}
