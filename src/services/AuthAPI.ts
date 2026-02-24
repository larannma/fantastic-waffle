import { HTTPTransport } from './HTTPTransport';

const API_BASE_URL = 'https://ya-praktikum.tech/api/v2';

export interface SignUpData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
  [key: string]: string;
}

export interface SignInData {
  login: string;
  password: string;
  [key: string]: string;
}

export interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

class AuthAPI {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport();
  }

  signUp(data: SignUpData): Promise<XMLHttpRequest> {
    return this.http.post(`${API_BASE_URL}/auth/signup`, {
      data,
    });
  }

  signIn(data: SignInData): Promise<XMLHttpRequest> {
    return this.http.post(`${API_BASE_URL}/auth/signin`, {
      data,
    });
  }

  logout(): Promise<XMLHttpRequest> {
    return this.http.post(`${API_BASE_URL}/auth/logout`);
  }

  getUser(): Promise<XMLHttpRequest> {
    return this.http.get(`${API_BASE_URL}/auth/user`);
  }
}

export default new AuthAPI();
