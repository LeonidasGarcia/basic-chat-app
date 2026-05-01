import type { Message, Sender } from '@/lib/chat-types';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface ChatSocketStore {
  userData?: Sender;
  socket?: Socket;
  messages: Message[];
  usersTyping: Sender[];
  connect: () => void;
  identify: (username: string) => void;
  sendMessage: (content: string) => void;
  setTypingStatus: (isTyping: boolean) => void;
  //disconnect: () => void;
}

type TypingUpdate = Sender & { isTyping: boolean };

// TODO Typing logic for the future

export const useChatSocketStore = create<ChatSocketStore>((set, get) => ({
  userData: undefined,
  socket: undefined,
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
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on(
      'typing:update',
      ({ userId, username, isTyping }: TypingUpdate) => {
        console.log(userId, username, isTyping);
        if (isTyping) {
          const { usersTyping } = get();

          const user = usersTyping.find((user) => user.userId === userId);

          if (!user) {
            set({
              usersTyping: [
                ...usersTyping,
                {
                  userId,
                  username,
                },
              ],
            });
          }
        } else {
          set((state) => ({
            usersTyping: state.usersTyping.filter(
              (user) => user.userId !== userId,
            ),
          }));
        }
      },
    );

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
  sendMessage: (content) => {
    const { socket } = get();
    if (!socket) return;

    const {
      userData: { userId },
    } = get();

    if (!userId) return;

    socket.emit('message:send', { content, clientMessageId: userId });
  },
  setTypingStatus: (isTyping) => {
    const { socket } = get();
    if (!socket) return;

    socket.emit('typing', { isTyping });
  },
}));
