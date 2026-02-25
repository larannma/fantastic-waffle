import { WS_BASE_URL } from '../constants/api';

export interface Message {
  id?: number | string;
  user_id: number | string;
  chat_id?: number | string;
  type: string;
  time?: string;
  content: string;
  is_read?: boolean;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

type MessageHandler = (messages: Message | Message[]) => void;
type OpenHandler = () => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private openHandlers: OpenHandler[] = [];
  private pingInterval: number | undefined;
  private pendingMessages: string[] = [];

  connect(chatId: number, userId?: number, token?: string) {
    this.close();
    this.pendingMessages = [];

    const wsUrl = userId && token
      ? `${WS_BASE_URL}/chats/${userId}/${chatId}/${token}`
      : `${WS_BASE_URL}/chats/${chatId}/`;

    const socket = new WebSocket(wsUrl);
    this.socket = socket;

    socket.addEventListener('open', () => {
      if (this.socket !== socket) {
        return;
      }

      this.startPing();
      this.flushPendingMessages();
      this.openHandlers.forEach((handler) => handler());
    });

    socket.addEventListener('close', () => {
      if (this.socket !== socket) {
        return;
      }

      this.stopPing();
      this.socket = null;
    });

    socket.addEventListener('message', (event) => {
      if (this.socket !== socket) {
        return;
      }

      try {
        const data: unknown = JSON.parse(event.data);

        if (Array.isArray(data)) {
          this.messageHandlers.forEach((handler) => handler(data as Message[]));
          return;
        }

        if (typeof data === 'object' && data !== null && 'type' in data) {
          const socketData = data as Message;
          if (socketData.type === 'message' || socketData.type === 'file' || socketData.type === 'sticker') {
            this.messageHandlers.forEach((handler) => handler(socketData));
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    socket.addEventListener('error', (error) => {
      if (this.socket !== socket) {
        return;
      }

      console.error('WebSocket error:', error);
    });
  }

  sendMessage(message: string) {
    this.sendRaw({
      content: message,
      type: 'message',
    });
  }

  sendFile(resourceId: string | number) {
    this.sendRaw({
      content: String(resourceId),
      type: 'file',
    });
  }

  getOldMessages(offset: number = 0) {
    this.sendRaw({
      content: String(offset),
      type: 'get old',
    });
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  offMessage(handler: MessageHandler) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  onOpen(handler: OpenHandler) {
    this.openHandlers.push(handler);
  }

  offOpen(handler: OpenHandler) {
    this.openHandlers = this.openHandlers.filter((h) => h !== handler);
  }

  close() {
    this.stopPing();

    const socket = this.socket;
    this.socket = null;

    if (socket) {
      socket.close();
    }
  }

  private sendRaw(payload: Record<string, string>) {
    const message = JSON.stringify(payload);

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      return;
    }

    if (this.socket?.readyState === WebSocket.CONNECTING) {
      this.pendingMessages.push(message);
      return;
    }

    console.error('WebSocket is not open');
  }

  private startPing() {
    this.stopPing();

    this.pingInterval = window.setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 10000);
  }

  private flushPendingMessages() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN || !this.pendingMessages.length) {
      return;
    }

    this.pendingMessages.forEach((message) => this.socket?.send(message));
    this.pendingMessages = [];
  }

  private stopPing() {
    if (this.pingInterval !== undefined) {
      clearInterval(this.pingInterval);
      this.pingInterval = undefined;
    }
  }
}

export default new WebSocketService();
