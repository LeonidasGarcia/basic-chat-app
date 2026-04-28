import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { GENERAL_ROOM } from './constants';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async identifyUser(usernameRaw: string) {
    const username = usernameRaw.trim();

    return this.prisma.user.upsert({
      where: { username },
      create: { username },
      update: {},
      select: { id: true, username: true },
    });
  }

  async createMessage(params: { senderId: string; contentRaw: string }) {
    const content = params.contentRaw.trim();

    return this.prisma.message.create({
      data: {
        roomKey: GENERAL_ROOM,
        content,
        senderId: params.senderId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: { select: { id: true, username: true } },
      },
    });
  }

  async getRecentMessages(limit = 50) {
    return this.prisma.message.findMany({
      where: { roomKey: GENERAL_ROOM },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 200),
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: { select: { id: true, username: true } },
      },
    });
  }
}
