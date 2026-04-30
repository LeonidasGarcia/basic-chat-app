export type Sender = {
  userId: string;
  username: string;
};

export type Message = {
  messageId: string;
  sender: Sender;
  content: string;
  createdAt: string;
};

export type ConnectionState = "connecting" | "connected" | "disconnected" | "error";