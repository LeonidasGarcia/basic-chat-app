import { useEffect, useState } from 'react';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { UsernameModal } from '@/components/UsernameModal';
import { useChatSocketStore } from './stores/useChatSocket';

export default function App() {
  const {
    messages,
    userData,
    usersTyping,
    connect,
    identify,
    sendMessage,
    socket,
    setTypingStatus,
  } = useChatSocketStore();
  const [modalError, setModalError] = useState<string>();

  const isIdentified = !!userData;

  useEffect(() => {
    connect();
  }, [connect]);

  const handleIdentify = (username: string) => {
    if (!socket) return;
    setModalError(undefined);

    const handler = (err: unknown) => {
      console.log(err);
      setModalError((err as { code: string; message: string }).message);
      socket.off('error', handler);
    };

    socket.on('error', handler);
    identify(username);
  };

  const handleSend = (content: string) => {
    sendMessage(content);
  };

  return (
    <>
      <UsernameModal
        open={!isIdentified}
        onSubmit={handleIdentify}
        error={modalError}
      />
      <div className="m-auto flex h-dvh w-1/4 flex-1 flex-col overflow-hidden bg-background font-sans">
        <ConnectionStatus status="connected" />
        <MessageList messages={messages} currentUserId={userData?.userId} />
        <TypingIndicator users={usersTyping} />
        <ChatInput onSend={handleSend} onTyping={setTypingStatus} />
      </div>
    </>
  );
}
