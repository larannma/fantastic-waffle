import AuthAPI from './AuthAPI';
import type { User } from './AuthAPI';

class AuthStore {
  private currentUser: User | null = null;
  private isAuthenticated: boolean = false;

  async checkAuth(): Promise<boolean> {
    try {
      const response = await AuthAPI.getUser();
      if (response.status === 200) {
        this.currentUser = JSON.parse(response.responseText);
        this.isAuthenticated = true;
        return true;
      }

      this.currentUser = null;
      this.isAuthenticated = false;
    } catch (error) {
      this.currentUser = null;
      this.isAuthenticated = false;
    }

    return false;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  setUser(user: User | null) {
    this.currentUser = user;
    this.isAuthenticated = !!user;
  }

  async logout() {
    try {
      await AuthAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.currentUser = null;
      this.isAuthenticated = false;
    }
  }
}

export default new AuthStore();
