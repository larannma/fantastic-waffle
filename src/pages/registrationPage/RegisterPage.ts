import { Component } from '../../services/Component';
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

  componentDidMount() {
    const form = this.getContent().querySelector<HTMLFormElement>('.register__form');
    if (!form) return;

    new ValidationForm(form);
  }

  private onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = this.getContent().querySelector<HTMLFormElement>('.register__form');
    if (!form) return;

    const validator = new ValidationForm(form);

    if (validator.validateForm()) {
      const values = validator.getValues();
      console.log('✅ Registration form valid, collected values:', values);
    } else {
      console.log('❌ Registration form invalid');
    }
  }

  private onRegisterClick(e: MouseEvent) {
    e.preventDefault();
    // Trigger form submission
    const form = this.getContent().querySelector<HTMLFormElement>('.register__form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  }

  private onSignInClick(e: MouseEvent) {
    e.preventDefault();
    // Emit custom event for navigation
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'login' },
      bubbles: true
    }));
  }
}
