import { useState, type FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

type UsernameModalProps = {
  open: boolean;
  onSubmit: (username: string) => void;
  error?: string;
};

export function UsernameModal({ open, onSubmit, error }: UsernameModalProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 2 || trimmed.length > 32) return;
    onSubmit(trimmed);
    setUsername('');
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Bienvenido al chat</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <p className="text-sm text-muted-foreground">
              Elige un nombre de usuario para unirte
            </p>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="alice_123"
              maxLength={32}
              pattern="^[a-zA-Z0-9_.\-]+$"
              required
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="size-4" />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full">
              Unirse al chat
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
