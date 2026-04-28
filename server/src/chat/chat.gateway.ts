import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatService } from './chat.service';
import { GENERAL_ROOM } from './constants';
import { IdentifyDto } from './dto/identify.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { TypingDto } from './dto/typing.dto';
import {
  AuthIdentifiedPayload,
  ErrorPayload,
  MessageNewPayload,
  SendMessageAck,
  ServerReadyPayload,
  TypingAck,
  TypingUpdatePayload,
} from './types/events';

type ChatSocketData = {
  userId?: string;
  username?: string;
};

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true,
  },
})
export class ChatGateway {
  constructor(private readonly chat: ChatService) {}

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    client.join(GENERAL_ROOM);

    const payload: ServerReadyPayload = {
      now: new Date().toISOString(),
    };
    client.emit('server:ready', payload);
  }

  handleDisconnect(_client: Socket) {
    // No-op for MVP.
  }

  @SubscribeMessage('auth:identify')
  async identify(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: IdentifyDto,
  ): Promise<AuthIdentifiedPayload | void> {
    try {
      const user = await this.chat.identifyUser(dto.username);

      (client.data as ChatSocketData).userId = user.id;
      (client.data as ChatSocketData).username = user.username;

      const payload: AuthIdentifiedPayload = {
        userId: user.id,
        username: user.username,
      };

      client.emit('auth:identified', payload);
      return payload; // Socket.IO ack callback
    } catch {
      this.emitError(client, {
        code: 'IDENTIFY_FAILED',
        message: 'Could not identify user.',
      });
    }
  }

  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ): Promise<SendMessageAck | void> {
    const { userId, username } = client.data as ChatSocketData;

    if (!userId || !username) {
      this.emitError(client, {
        code: 'UNIDENTIFIED',
        message: 'Call auth:identify before sending messages.',
      });
      return;
    }

    try {
      const msg = await this.chat.createMessage({
        senderId: userId,
        contentRaw: dto.content,
      });

      const broadcast: MessageNewPayload = {
        messageId: msg.id,
        sender: { userId: msg.sender.id, username: msg.sender.username },
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
      };

      this.server.to(GENERAL_ROOM).emit('message:new', broadcast);

      const ack: SendMessageAck = {
        messageId: msg.id,
        createdAt: msg.createdAt.toISOString(),
        ...(dto.clientMessageId ? { clientMessageId: dto.clientMessageId } : {}),
      };

      return ack;
    } catch {
      this.emitError(client, {
        code: 'MESSAGE_SEND_FAILED',
        message: 'Could not send message.',
      });
    }
  }

  @SubscribeMessage('typing')
  async typing(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: TypingDto,
  ): Promise<TypingAck | void> {
    const { userId, username } = client.data as ChatSocketData;

    if (!userId || !username) {
      this.emitError(client, {
        code: 'UNIDENTIFIED',
        message: 'Call auth:identify before typing.',
      });
      return;
    }

    const payload: TypingUpdatePayload = {
      userId,
      username,
      isTyping: dto.isTyping,
    };

    // Broadcast to everyone else in the general room.
    client.to(GENERAL_ROOM).emit('typing:update', payload);
    return { ok: true };
  }

  private emitError(client: Socket, payload: ErrorPayload) {
    client.emit('error', payload);
  }
}
