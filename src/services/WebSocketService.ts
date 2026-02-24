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

  connect(chatId: number, userId?: number, token?: string) {
    this.close();

    const wsUrl = userId && token
      ? `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`
      : `wss://ya-praktikum.tech/ws/chats/${chatId}/`;

    this.socket = new WebSocket(wsUrl);

    this.socket.addEventListener('open', () => {
      this.startPing();
      this.openHandlers.forEach((handler) => handler());
    });

    this.socket.addEventListener('close', () => {
      this.stopPing();
      this.socket = null;
    });

    this.socket.addEventListener('message', (event) => {
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

    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  sendMessage(message: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          content: message,
          type: 'message',
        })
      );
    } else {
      console.error('WebSocket is not open');
    }
  }

  sendFile(resourceId: string | number) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          content: String(resourceId),
          type: 'file',
        })
      );
    }
  }

  getOldMessages(offset: number = 0) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          content: String(offset),
          type: 'get old',
        })
      );
    }
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

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private startPing() {
    this.stopPing();

    this.pingInterval = window.setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 10000);
  }

  private stopPing() {
    if (this.pingInterval !== undefined) {
      clearInterval(this.pingInterval);
      this.pingInterval = undefined;
    }
  }
}

export default new WebSocketService();
