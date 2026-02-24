import { HTTPTransport } from './HTTPTransport';

const API_BASE_URL = 'https://ya-praktikum.tech/api/v2';

export interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  created_by: number;
  unread_count: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  } | null;
}

export interface CreateChatData {
  title: string;
  [key: string]: string | number;
}

export interface AddUserToChatData {
  users: number[];
  chatId: number;
  [key: string]: number | number[];
}

export interface AddUserToChatRequest {
  users: number[];
  chatId: number;
}

export interface DeleteUserFromChatData {
  users: number[];
  chatId: number;
  [key: string]: number | number[];
}

export interface ChatTokenResponse {
  token: string;
}

class ChatAPI {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport();
  }

  getChats(): Promise<XMLHttpRequest> {
    return this.http.get(`${API_BASE_URL}/chats`);
  }

  createChat(data: CreateChatData): Promise<XMLHttpRequest> {
    return this.http.post(`${API_BASE_URL}/chats`, {
      data,
    });
  }

  addUserToChat(users: number[], chatId: number): Promise<XMLHttpRequest> {
    return this.http.put(`${API_BASE_URL}/chats/users`, {
      data: { users, chatId },
    });
  }

  deleteUserFromChat(users: number[], chatId: number): Promise<XMLHttpRequest> {
    return this.http.delete(`${API_BASE_URL}/chats/users`, {
      data: { users, chatId },
    });
  }

  getChatToken(chatId: number): Promise<XMLHttpRequest> {
    return this.http.post(`${API_BASE_URL}/chats/token/${chatId}`);
  }
}

export default new ChatAPI();
