import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { useChatSocketStore } from './stores/useChatSocket';

export default function App() {
  const { messages, userData, usersTyping } = useChatSocketStore();

  return (
    <div className="m-auto flex h-dvh w-1/4 flex-1 flex-col overflow-hidden bg-background font-sans">
      <ConnectionStatus status="connected" />
      <MessageList messages={messages} currentUserId={userData?.userId} />
      <TypingIndicator users={usersTyping} />
      <ChatInput onSend={() => {}} onTyping={() => {}} />
    </div>
  );
}
