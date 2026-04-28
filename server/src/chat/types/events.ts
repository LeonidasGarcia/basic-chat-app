export type ErrorPayload = {
  code: string;
  message: string;
};

export type ServerReadyPayload = {
  now: string;
};

export type AuthIdentifiedPayload = {
  userId: string;
  username: string;
};

export type MessageNewPayload = {
  messageId: string;
  sender: {
    userId: string;
    username: string;
  };
  content: string;
  createdAt: string;
};

export type TypingUpdatePayload = {
  userId: string;
  username: string;
  isTyping: boolean;
};

export type IdentifyAck = AuthIdentifiedPayload;

export type SendMessageAck = {
  messageId: string;
  createdAt: string;
  clientMessageId?: string;
};

export type TypingAck = { ok: true };
