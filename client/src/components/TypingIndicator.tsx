import { Badge } from "@/components/ui/badge";

type TypingIndicatorProps = {
  users: string[];
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
  if (users.length === 0) return null;

  const label =
    users.length === 1
      ? `${users[0]} está escribiendo`
      : users.length === 2
        ? `${users[0]} y ${users[1]} están escribiendo`
        : `${users[0]} y ${users.length - 1} más están escribiendo`;

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <AnimatedDots />
      <Badge variant="secondary" className="text-xs font-normal">
        {label}
      </Badge>
    </div>
  );
}