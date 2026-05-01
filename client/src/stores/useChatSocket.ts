import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface ChatSocketStore {
  socket?: Socket;
  //messages: any[];

  connect: () => void;
  //disconnect: () => void;
  //sendMessage: () => void;
}

export const useChatSocketStore = create<ChatSocketStore>((set, get) => ({
  socket: null,
  messages: [],
  connect: () => {
    const socket = io('http://localhost:3001/chat');

    socket.on('server:ready', (ack) => {
      console.log(ack);
    });

    set({ socket });
  },
}));
