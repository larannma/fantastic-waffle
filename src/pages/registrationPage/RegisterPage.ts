import AuthAPI from '../../services/AuthAPI';
import { Component } from '../../services/Component';
import Router from '../../services/Router';
import { ValidationForm } from '../../services/ValidationForm';
import template from './registerPage.hbs';
import './registerPage.scss';

interface RegisterPageProps {
  class: string;
  '.register__form': {
    submit: (e: SubmitEvent) => void;
  };
  '.register__register-button': {
    click: (e: MouseEvent) => void;
  };
  '.register__sign-in-link': {
    click: (e: MouseEvent) => void;
  };
  [key: string]: unknown;
}

export class RegisterPage extends Component<RegisterPageProps> {

  constructor() {
    super('main', {
      class: 'main',
      '.register__form': {
        submit: (e: SubmitEvent) => this.onSubmit(e),
      },
      '.register__register-button': {
        click: (e: MouseEvent) => this.onRegisterClick(e),
      },
      '.register__sign-in-link': {
        click: (e: MouseEvent) => this.onSignInClick(e),
      },
    });
  }

  render() {
    return template(this.props);
  }

  async componentDidMount() {
    const form = this.getContent().querySelector<HTMLFormElement>('.register__form');
    if (!form) {
      return;
    }

    new ValidationForm(form);
  }

  private async onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = this.getContent().querySelector<HTMLFormElement>('.register__form');
    if (!form) {
      return;
    }

    const validator = new ValidationForm(form);

    if (validator.validateForm()) {
      const values = validator.getValues();
      const signUpData = {
        email: values.email as string,
        login: values.login as string,
        first_name: values.first_name as string,
        second_name: values.second_name as string,
        phone: values.phone as string,
        password: values.password as string,
      };

      try {
        const response = await AuthAPI.signUp(signUpData);

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

          console.error('Registration failed:', response.status, errorMessage);
          console.error('Response text:', response.responseText);
          alert(`Ошибка регистрации: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('Произошла ошибка при регистрации. Проверьте консоль для деталей.');
      }
    }
  }

  private onRegisterClick(e: MouseEvent) {
    e.preventDefault();
    const form = this.getContent().querySelector<HTMLFormElement>('.register__form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  }

  private onSignInClick(e: MouseEvent) {
    e.preventDefault();
    const router = new Router();
    router.go('/');
  }
}
