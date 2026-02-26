import { BASE_URL } from '../constants/api';
import { HTTPTransport } from './HTTPTransport';

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

export interface ChatUser {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export interface CreateChatData {
  title: string;
  [key: string]: string;
}

export interface ChatUsersPayload {
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
    return this.http.get(`${BASE_URL}/chats`);
  }

  createChat(data: CreateChatData): Promise<XMLHttpRequest> {
    return this.http.post(`${BASE_URL}/chats`, {
      data,
    });
  }

  deleteChat(chatId: number): Promise<XMLHttpRequest> {
    return this.http.delete(`${BASE_URL}/chats`, {
      data: { chatId },
    });
  }

  changeChatAvatar(data: FormData): Promise<XMLHttpRequest> {
    return this.http.put(`${BASE_URL}/chats/avatar`, {
      data,
    });
  }

  addUserToChat(data: ChatUsersPayload): Promise<XMLHttpRequest> {
    return this.http.put(`${BASE_URL}/chats/users`, {
      data,
    });
  }

  deleteUserFromChat(data: ChatUsersPayload): Promise<XMLHttpRequest> {
    return this.http.delete(`${BASE_URL}/chats/users`, {
      data,
    });
  }

  getChatUsers(chatId: number): Promise<XMLHttpRequest> {
    return this.http.get(`${BASE_URL}/chats/${chatId}/users`);
  }

  getChatToken(chatId: number): Promise<XMLHttpRequest> {
    return this.http.post(`${BASE_URL}/chats/token/${chatId}`);
  }
}

export default new ChatAPI();
