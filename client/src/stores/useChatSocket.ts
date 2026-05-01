import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface Message {
  message: string;
  sender: UserData;
  content: string;
  createdAt: string;
}

interface UserData {
  username: string;
  userId: string;
}

interface ChatSocketStore {
  userData?: UserData;
  socket?: Socket;
  messages: Message[];

  connect: () => void;
  identify: (username: string) => void;
  //disconnect: () => void;
  sendMessage: (content: string, clientMessageId: string) => void;
}

export const useChatSocketStore = create<ChatSocketStore>((set, get) => ({
  userData: null,
  socket: null,
  messages: [],
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
