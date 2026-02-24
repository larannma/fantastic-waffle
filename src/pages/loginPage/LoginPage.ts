import AuthAPI from '../../services/AuthAPI';
import { Component } from '../../services/Component';
import Router from '../../services/Router';
import { ValidationForm } from '../../services/ValidationForm';
import template from './loginPage.hbs';
import './loginPage.scss';

interface LoginPageProps {
  class: string;
  '.login__form': {
    submit: (e: SubmitEvent) => void;
  };
  '.login__register-link': {
    click: (e: MouseEvent) => void;
  };
  [key: string]: unknown;
}

export class LoginPage extends Component<LoginPageProps> {

  constructor() {
    super('main', {
      class: 'main',
      '.login__form': {
        submit: (e: SubmitEvent) => this.onSubmit(e),
      },
      '.login__register-link': {
        click: (e: MouseEvent) => this.onRegisterClick(e),
      },
    });
  }

  render() {
    return template(this.props);
  }

  async componentDidMount() {
    const form = this.getContent().querySelector<HTMLFormElement>('.login__form');
    if (!form) {
      return;
    }

    new ValidationForm(form);
  }

  private async onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = this.getContent().querySelector<HTMLFormElement>('.login__form');
    if (!form) {
      return;
    }

    const validator = new ValidationForm(form);

    if (validator.validateForm()) {
      const values = validator.getValues();
      const signInData = {
        login: values.login as string,
        password: values.password as string,
      };

      try {
        const response = await AuthAPI.signIn(signInData);

        if (response.status === 200) {
          const router = new Router();
          router.go('/messenger');
        } else {
          let errorMessage = response.statusText;
          try {
            const errorData = JSON.parse(response.responseText);
            errorMessage = errorData.reason || errorData.message || errorMessage;
          } catch (_error) {
            // Если ответ не JSON, используем statusText.
          }

          console.error('Login failed:', response.status, errorMessage);
          alert(`Ошибка входа: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Произошла ошибка при входе. Проверьте консоль для деталей.');
      }
    }
  }

  private onRegisterClick(e: MouseEvent) {
    e.preventDefault();
    const router = new Router();
    router.go('/sign-up');
  }
}
