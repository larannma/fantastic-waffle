import { Component } from '../../services/Component';
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

  componentDidMount() {
    const form = this.getContent().querySelector<HTMLFormElement>('.login__form');
    if (!form) return;

    // чтобы работало сразу на блюре
    new ValidationForm(form);
  }

  private onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = this.getContent().querySelector<HTMLFormElement>('.login__form');
    if (!form) return;

    const validator = new ValidationForm(form);

    if (validator.validateForm()) {
      const values = validator.getValues();
      console.log('✅ Form valid, collected values:', values);
    } else {
      console.log('❌ Form invalid');
    }
  }

  private onRegisterClick(e: MouseEvent) {
    e.preventDefault();
    // Emit custom event for navigation
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'register' },
      bubbles: true
    }));
  }
}
