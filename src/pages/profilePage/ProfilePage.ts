import type { User } from '../../services/AuthAPI';
import AuthStore from '../../services/AuthStore';
import { Component } from '../../services/Component';
import Router from '../../services/Router';
import UserAPI from '../../services/UserAPI';
import { ValidationForm } from '../../services/ValidationForm';
import template from './profilePage.hbs';
import './profilePage.scss';

interface ProfilePageProps {
  class: string;
  '.profile__back-to-chats': {
    click: (e: MouseEvent) => void;
  };
  '.profile__save-btn': {
    click: (e: MouseEvent) => void;
  };
  '.profile__logout-btn': {
    click: (e: MouseEvent) => void;
  };
  '#avatar': {
    change: (e: Event) => void;
  };
  [key: string]: unknown;
}

export class ProfilePage extends Component<ProfilePageProps> {
  constructor() {
    super('main', {
      class: 'main',
      '.profile__back-to-chats': {
        click: (e: MouseEvent) => this.onBackToChats(e),
      },
      '.profile__save-btn': {
        click: (e: MouseEvent) => this.onSaveChanges(e),
      },
      '.profile__logout-btn': {
        click: (e: MouseEvent) => this.onLogout(e),
      },
      '#avatar': {
        change: (e: Event) => this.onAvatarChange(e),
      },
    });
  }

  render() {
    return template(this.props);
  }

  async componentDidMount() {
    const form = this.getContent().querySelector<HTMLFormElement>('.profile__form');
    if (!form) return;

    // Инициализируем валидацию формы
    new ValidationForm(form);

    // Загружаем данные пользователя
    await this.loadUserData();
  }

  private async loadUserData() {
    try {
      const user = AuthStore.getUser();
      if (user) {
        this.fillFormWithUserData(user);
      } else {
        await AuthStore.checkAuth();
        const updatedUser = AuthStore.getUser();
        if (updatedUser) {
          this.fillFormWithUserData(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  private fillFormWithUserData(user: User) {
    if (!user) return;

    const form = this.getContent().querySelector<HTMLFormElement>('.profile__form');
    if (!form) return;

    const emailInput = form.querySelector<HTMLInputElement>('#email');
    const loginInput = form.querySelector<HTMLInputElement>('#login');
    const firstNameInput = form.querySelector<HTMLInputElement>('#first_name');
    const secondNameInput = form.querySelector<HTMLInputElement>('#second_name');
    const displayNameInput = form.querySelector<HTMLInputElement>('#display_name');
    const phoneInput = form.querySelector<HTMLInputElement>('#phone');
    const avatarImg = this.getContent().querySelector<HTMLImageElement>('.profile__top-info-image');

    if (emailInput) emailInput.value = user.email || '';
    if (loginInput) loginInput.value = user.login || '';
    if (firstNameInput) firstNameInput.value = user.first_name || '';
    if (secondNameInput) secondNameInput.value = user.second_name || '';
    if (displayNameInput) displayNameInput.value = user.display_name || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (avatarImg && user.avatar) {
      avatarImg.src = `https://ya-praktikum.tech/api/v2/resources${user.avatar}`;
    }

    const nameElement = this.getContent().querySelector('.profile__top-info p');
    if (nameElement) {
      nameElement.textContent = user.display_name || user.first_name || '';
    }
  }

  private onBackToChats(e: MouseEvent) {
    e.preventDefault();
    const router = new Router();
    router.go('/messenger');
  }

  private async onLogout(e: MouseEvent) {
    e.preventDefault();
    await AuthStore.logout();
    const router = new Router();
    router.go('/', true);
  }

  private async onAvatarChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await UserAPI.changeAvatar(formData);
      if (response.status === 200) {
        await AuthStore.checkAuth();
        await this.loadUserData();
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  }

  private async onSaveChanges(e: MouseEvent) {
    e.preventDefault();
    const form = this.getContent().querySelector<HTMLFormElement>('.profile__form');
    if (!form) return;

    const validator = new ValidationForm(form);
    
    if (!validator.validateForm()) {
      return;
    }

    const values = validator.getValues();
    const oldPassword = values.oldPassword;
    const newPassword = values.newPassword;

    try {
      // Обновляем данные профиля (без полей пароля)
      const profileData = {
        email: values.email as string,
        login: values.login as string,
        first_name: values.first_name as string,
        second_name: values.second_name as string,
        display_name: values.display_name as string,
        phone: values.phone as string,
      };

      const profileResponse = await UserAPI.changeProfile(profileData);
      if (profileResponse.status !== 200) {
        console.error('Error updating profile');
        return;
      }

      // Обновляем пароль, если заполнены оба поля
      if (oldPassword && newPassword) {
        const passwordResponse = await UserAPI.changePassword({
          oldPassword,
          newPassword,
        });
        if (passwordResponse.status !== 200) {
          console.error('Error updating password');
        }
      }

      // Перезагружаем данные пользователя
      await AuthStore.checkAuth();
      await this.loadUserData();

      // Очищаем поля пароля
      const oldPasswordInput = form.querySelector<HTMLInputElement>('#oldPassword');
      const newPasswordInput = form.querySelector<HTMLInputElement>('#newPassword');
      if (oldPasswordInput) oldPasswordInput.value = '';
      if (newPasswordInput) newPasswordInput.value = '';
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  }
}
