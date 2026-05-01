import { useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';

type ChatInputProps = {
  onSend: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
};

export function ChatInput({ onSend, onTyping }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const content = textareaRef.current?.value.trim() ?? '';
    if (!content) return;
    onSend(content);
    if (textareaRef.current) textareaRef.current.value = '';
    onTyping(false);
  }, [onSend, onTyping]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleChange = useCallback(
    (e) => {
      if (e.target.value === '') {
        onTyping(false);
      } else {
        onTyping(true);
      }
    },
    [onTyping],
  );

  return (
    <div className="flex items-end gap-2 border-t bg-background px-4 py-3">
      <Textarea
        ref={textareaRef}
        placeholder="Escribe un mensaje..."
        className="min-h-10 max-h-32 resize-none flex-1"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        rows={1}
      />
      <Button size="icon" onClick={handleSend} className="shrink-0">
        <SendHorizontal className="size-4" />
      </Button>
    </div>
  );
}
