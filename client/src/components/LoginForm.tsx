import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

type LoginFormProps = {
  onSubmit: (username: string) => void;
  error?: string;
};

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 2 || trimmed.length > 32) return;
    onSubmit(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col items-center justify-center gap-4 px-6"
    >
      <h1 className="text-xl font-semibold">Basic Chat</h1>
      <p className="text-sm text-muted-foreground">
        Elige un nombre de usuario para unirte
      </p>
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="alice_123"
        className="max-w-xs text-center"
        maxLength={32}
        pattern="^[a-zA-Z0-9_.\-]+$"
        required
      />
      <Button type="submit" className="w-full max-w-xs">
        Unirse al chat
      </Button>
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}