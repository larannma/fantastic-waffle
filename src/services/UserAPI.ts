import { BASE_URL } from '../constants/api';
import { HTTPTransport } from './HTTPTransport';

export interface UserProfileData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  [key: string]: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  [key: string]: string;
}

export interface UserSearchResult {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

class UserAPI {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport();
  }

  changeProfile(data: UserProfileData): Promise<XMLHttpRequest> {
    return this.http.put(`${BASE_URL}/user/profile`, {
      data,
    });
  }

  changeAvatar(data: FormData): Promise<XMLHttpRequest> {
    return this.http.put(`${BASE_URL}/user/profile/avatar`, {
      data,
    });
  }

  changePassword(data: ChangePasswordData): Promise<XMLHttpRequest> {
    return this.http.put(`${BASE_URL}/user/password`, {
      data,
    });
  }

  searchUsers(login: string): Promise<XMLHttpRequest> {
    return this.http.post(`${BASE_URL}/user/search`, {
      data: { login },
    });
  }
}

export default new UserAPI();
