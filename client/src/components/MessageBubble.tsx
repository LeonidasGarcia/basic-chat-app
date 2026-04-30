import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/chat-types";

type MessageBubbleProps = {
  message: Message;
  isSelf: boolean;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name: string) {
  return name
    .split(/[._-]/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function MessageBubble({ message, isSelf }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isSelf ? "items-end" : "items-start"
      )}
    >
      {!isSelf && (
        <div className="flex items-center gap-2 px-2">
          <Avatar size="sm">
            <AvatarFallback>{getInitials(message.sender.username)}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-muted-foreground">
            {message.sender.username}
          </span>
        </div>
      )}
      <div
        className={cn(
          "max-w-xs break-words rounded-2xl px-3 py-2 text-sm",
          isSelf
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted rounded-bl-md"
        )}
      >
        {message.content}
      </div>
      <span className="px-2 text-[10px] text-muted-foreground">
        {formatTime(message.createdAt)}
      </span>
    </div>
  );
}