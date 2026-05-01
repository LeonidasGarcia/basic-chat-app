import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/chat-types';
import { MessageBubble } from './MessageBubble';

type MessageListProps = {
  messages: Message[];
  currentUserId?: string;
};

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.messageId}
          message={msg}
          isSelf={msg.sender.userId === currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
