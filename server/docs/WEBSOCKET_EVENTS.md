# WebSocket Events (Socket.IO) - Basic Chat

Endpoint (dev): `http://localhost:3001/chat`

Notes:

- Transport is Socket.IO (WebSocket + fallbacks). Connect to the namespace `/chat`.
- The server automatically places every connection into the internal room `general`.
- You must identify once per connection before sending messages.

## Client -> Server

### `auth:identify`

Identify the user for this socket.

Payload:

```json
{ "username": "alice" }
```

Ack (Socket.IO callback response):

```json
{ "userId": "<uuid>", "username": "alice" }
```

Server also emits: `auth:identified` with the same payload.
After successful identification, the server also emits `messages:history` containing the latest 50 stored messages in chronological order.

### `message:send`

Send a message to the global chat.

Payload:

```json
{ "content": "hola", "clientMessageId": "optional-local-id" }
```

Ack:

```json
{
  "messageId": "<uuid>",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "clientMessageId": "optional-local-id"
}
```

Broadcast:

- Server emits `message:new` to everyone (including the sender).

Errors:desc

- If you didn't call `auth:identify` yet, server emits `error` with code `UNIDENTIFIED`.

### `typing`

Typing indicator.

Payload:

```json
{ "isTyping": true }
```

Ack:

```json
{ "ok": true }
```

Broadcast:

- Server emits `typing:update` to everyone else (excludes the sender).

## Server -> Client

### `server:ready`

Emitted right after connect.

Payload:

```json
{ "now": "2026-01-01T00:00:00.000Z" }
```

### `auth:identified`

Emitted after successful `auth:identify`.

Payload:

```json
{ "userId": "<uuid>", "username": "alice" }
```

### `message:new`

Broadcast for new messages.

Payload:

```json
{
  "messageId": "<uuid>",
  "sender": { "userId": "<uuid>", "username": "alice" },
  "content": "hola",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

### `messages:history`

Initial message history sent right after successful `auth:identify`.

Payload:

```json
{
  "messages": [
    {
      "messageId": "<uuid>",
      "sender": { "userId": "<uuid>", "username": "alice" },
      "content": "hola",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

Notes:

- Contains up to the latest 50 stored messages.
- Messages are ordered chronologically (oldest first).

### `typing:update`

Broadcast typing indicator.

Payload:

```json
{ "userId": "<uuid>", "username": "alice", "isTyping": true }
```

### `error`

Server-side error notification.

Payload:

```json
{
  "code": "UNIDENTIFIED",
  "message": "Call auth:identify before sending messages."
}
```

## Socket.IO Acks

Some client->server events return an **ack**. In Socket.IO this is a callback function you pass as the last argument to `emit`, and the server returns a JSON object into that callback.

Events using acks:

- `auth:identify`
- `message:send`
- `typing`
