import { Badge } from '@/components/ui/badge';
import type { Sender } from '@/lib/chat-types';
import { useChatSocketStore } from '@/stores/useChatSocket';

type TypingIndicatorProps = {
  users: Sender[];
};

function AnimatedDots() {
  return (
    <span className="relative flex items-end gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-muted-foreground"
          style={{
            animation: `typing-bounce 1.2s infinite ${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  const { userData } = useChatSocketStore();

  const filteredUsers = users.filter((user) => user.userId != userData.userId);

  if (filteredUsers.length === 0) return null;

  const label =
    filteredUsers.length === 1
      ? `${filteredUsers[0].username} está escribiendo`
      : filteredUsers.length === 2
        ? `${filteredUsers[0].username} y ${filteredUsers[1].username} están escribiendo`
        : `${filteredUsers[0].username} y ${filteredUsers.length - 1} más están escribiendo`;

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <AnimatedDots />
      <Badge variant="secondary" className="text-xs font-normal">
        {label}
      </Badge>
    </div>
  );
}
