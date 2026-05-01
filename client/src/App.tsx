import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import type { Message } from '@/lib/chat-types';
import { useChatSocketStore } from './stores/useChatSocket';
import { useEffect } from 'react';

const MOCK_MESSAGES: Message[] = [
  {
    messageId: '1',
    sender: { userId: 'u1', username: 'alice_dev' },
    content: 'Hola! Acabo de entrar al chat.',
    createdAt: '2026-04-30T09:00:00.000Z',
  },
  {
    messageId: '2',
    sender: { userId: 'u2', username: 'bob.py' },
    content: 'Hey! Que tal, todo bien por aqui.',

    createdAt: '2026-04-30T09:01:30.000Z',
  },
  {
    messageId: '3',
    sender: { userId: 'u3', username: 'charlie_beta' },
    content: 'Funcionando! Esto se ve muy limpio.',

    createdAt: '2026-04-30T09:02:15.000Z',
  },
  {
    messageId: '4',
    sender: { userId: 'u1', username: 'alice_dev' },
    content: 'Gracias! Estamos probando los componentes de UI ahora.',
    createdAt: '2026-04-30T09:03:00.000Z',
  },
  {
    messageId: '1',
    sender: { userId: 'u1', username: 'alice_dev' },
    content: 'Hola! Acabo de entrar al chat.',
    createdAt: '2026-04-30T09:00:00.000Z',
  },
  {
    messageId: '2',
    sender: { userId: 'u2', username: 'bob.py' },
    content: 'Hey! Que tal, todo bien por aqui.',

    createdAt: '2026-04-30T09:01:30.000Z',
  },
  {
    messageId: '3',
    sender: { userId: 'u3', username: 'charlie_beta' },
    content: 'Funcionando! Esto se ve muy limpio.',

    createdAt: '2026-04-30T09:02:15.000Z',
  },
  {
    messageId: '4',
    sender: { userId: 'u1', username: 'alice_dev' },
    content: 'Gracias! Estamos probando los componentes de UI ahora.',
    createdAt: '2026-04-30T09:03:00.000Z',
  },
  {
    messageId: '1',
    sender: { userId: 'u1', username: 'alice_dev' },
    content: 'Hola! Acabo de entrar al chat.',
    createdAt: '2026-04-30T09:00:00.000Z',
  },
  {
    messageId: '2',
    sender: { userId: 'u2', username: 'bob.py' },
    content: 'Hey! Que tal, todo bien por aqui.',

    createdAt: '2026-04-30T09:01:30.000Z',
  },
  {
    messageId: '3',
    sender: { userId: 'u3', username: 'charlie_beta' },
    content: 'Funcionando! Esto se ve muy limpio.',

    createdAt: '2026-04-30T09:02:15.000Z',
  },
  {
    messageId: '4',
    sender: { userId: 'u1', username: 'alice_dev' },
    content: 'Gracias! Estamos probando los componentes de UI ahora.',
    createdAt: '2026-04-30T09:03:00.000Z',
  },
  {
    messageId: '1',
    sender: { userId: 'u1', username: 'alice_dev' },
    content: 'Hola! Acabo de entrar al chat.',
    createdAt: '2026-04-30T09:00:00.000Z',
  },
  {
    messageId: '2',
    sender: { userId: 'u2', username: 'bob.py' },
    content: 'Hey! Que tal, todo bien por aqui.',

    createdAt: '2026-04-30T09:01:30.000Z',
  },
  {
    messageId: '3',
    sender: { userId: 'u3', username: 'charlie_beta' },
    content: 'Funcionando! Esto se ve muy limpio.',

    createdAt: '2026-04-30T09:02:15.000Z',
  },
  {
    messageId: '4',
    sender: { userId: 'u1', username: 'alice_dev' },
    content: 'Gracias! Estamos probando los componentes de UI ahora.',
    createdAt: '2026-04-30T09:03:00.000Z',
  },
];

const MOCK_CURRENT_USER = 'current_user';
const MOCK_TYPING_USERS = ['alice_dev', 'bob.py'];

export default function App() {
  const { connect, identify, sendMessage } = useChatSocketStore();

  useEffect(() => {
    connect();
    identify('Leo');
    sendMessage('Hola!', 'a9f03bc3-034a-40ee-a790-bb13a11f2289');
  }, []);

  return (
    <div className="m-auto flex h-dvh w-1/4 flex-1 flex-col overflow-hidden bg-background font-sans">
      <ConnectionStatus status="connected" />
      <MessageList messages={MOCK_MESSAGES} currentUserId={MOCK_CURRENT_USER} />
      <TypingIndicator users={MOCK_TYPING_USERS} />
      <ChatInput onSend={() => {}} onTyping={() => {}} />
    </div>
  );
}
