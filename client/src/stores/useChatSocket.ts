import type { Message, Sender } from '@/lib/chat-types';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface ChatSocketStore {
  userData?: Sender;
  socket?: Socket;
  messages: Message[];
  usersTyping: string[];
  connect: () => void;
  identify: (username: string) => void;
  sendMessage: (content: string, clientMessageId: string) => void;
  //disconnect: () => void;
}

// TODO Typing logic for the future

export const useChatSocketStore = create<ChatSocketStore>((set, get) => ({
  userData: null,
  socket: null,
  messages: [],
  usersTyping: [],
  connect: () => {
    const socket = io('http://localhost:3001/chat');

    socket.on('server:ready', () => {});

    socket.on('auth:identified', ({ userId, username }) => {
      set({ userData: { userId, username } });
    });

    socket.on('messages:history', ({ messages }: { messages: Message[] }) => {
      set({ messages });
    });

    socket.on('message:new', (message: Message) => {
      set((state) => {
        const updatedMessages = [...state.messages];
        updatedMessages.push(message);
        return {
          messages: updatedMessages,
        };
      });
    });

    socket.on('error', (err) => {
      console.log(err);
    });

    set({ socket });
  },
  identify: (username) => {
    const { socket } = get();
    if (!socket) return;

    socket.emit('auth:identify', { username });
  },
  sendMessage: (content, clientMessageId) => {
    const { socket } = get();
    if (!socket) return;

    socket.emit('message:send', { content, clientMessageId });
  },
}));
