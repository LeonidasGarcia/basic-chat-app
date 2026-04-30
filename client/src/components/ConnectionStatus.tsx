import { cn } from "@/lib/utils";
import { WifiOff, AlertTriangle, Loader2 } from "lucide-react";
import type { ConnectionState } from "@/lib/chat-types";

type ConnectionStatusProps = {
  status: ConnectionState;
  error?: string;
};

export function ConnectionStatus({ status, error }: ConnectionStatusProps) {
  if (status === "connected") return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b px-4 py-2 text-sm",
        status === "connecting" && "border-border bg-muted text-muted-foreground",
        status === "disconnected" && "border-border bg-muted text-muted-foreground",
        status === "error" && "border-destructive/50 bg-destructive/10 text-destructive"
      )}
    >
      {status === "connecting" && (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Conectando...</span>
        </>
      )}
      {status === "disconnected" && (
        <>
          <WifiOff className="size-4" />
          <span>Desconectado. Reconectando...</span>
        </>
      )}
      {status === "error" && (
        <>
          <AlertTriangle className="size-4" />
          <span>{error ?? "Error de conexión"}</span>
        </>
      )}
    </div>
  );
}