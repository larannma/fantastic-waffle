 
export class ValidationForm {
  private form: HTMLFormElement;
  private rules: Record<string, ((value: string) => string | null)[]>;

  constructor(form: HTMLFormElement) {
    this.form = form;

    this.rules = {
      first_name: [this.validateFirstName],
      second_name: [this.validateFirstName],
      login: [this.validateLogin],
      email: [this.validateEmail],
      password: [this.validatePassword],
      phone: [this.validatePhone],
      message: [this.validateMessage],
    };

    this.attachEvents();
  }

  private attachEvents() {
    Object.keys(this.rules).forEach((field) => {
      const input = this.form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${field}`);
      if (input) {
        input.addEventListener('blur', () => this.validateField(input));
      }
    });
  }

  private validateField(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    const rules = this.rules[input.id];
    if (!rules) return true;

    const errorEl = this.getErrorElement(input);
    let errorMsg: string | null = null;

    for (const rule of rules) {
      errorMsg = rule.call(this, input.value);
      if (errorMsg) break;
    }

    if (errorMsg) {
      errorEl.textContent = errorMsg;
      input.classList.add('input--error');
      return false;
    } else {
      errorEl.textContent = '';
      input.classList.remove('input--error');
      return true;
    }
  }

  /** Публичный метод для валидации всей формы */
  public validateForm(): boolean {
    let isValid = true;
    Object.keys(this.rules).forEach((field) => {
      const input = this.form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${field}`);
      if (input && !this.validateField(input)) {
        isValid = false;
      }
    });
    return isValid;
  }

  /** Публичный метод для получения значений всех полей */
  public getValues(): Record<string, string> {
    const values: Record<string, string> = {};
    Object.keys(this.rules).forEach((field) => {
      const input = this.form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${field}`);
      if (input) values[field] = input.value;
    });
    return values;
  }

  private getErrorElement(input: HTMLInputElement | HTMLTextAreaElement): HTMLElement {
    let errorEl = input.nextElementSibling as HTMLElement;
    if (!errorEl || !errorEl.classList.contains('input-error')) {
      errorEl = document.createElement('div');
      errorEl.className = 'input-error';
      input.insertAdjacentElement('afterend', errorEl);
    }
    return errorEl;
  }

  // --- regex rules ---
  private validateFirstName(value: string): string | null {
    return /^[A-ZА-ЯЁ][a-zа-яёA-ZА-ЯЁ-]*$/.test(value) ? null : 'Invalid name';
  }
  private validateLogin(value: string): string | null {
    return /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/.test(value) ? null : 'Invalid login';
  }
  private validateEmail(value: string): string | null {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(value) ? null : 'Invalid email';
  }
  private validatePassword(value: string): string | null {
    return /^(?=.*[A-Z])(?=.*\d).{8,40}$/.test(value) ? null : 'Invalid password';
  }
  private validatePhone(value: string): string | null {
    return /^\+?\d{10,15}$/.test(value) ? null : 'Invalid phone';
  }
  private validateMessage(value: string): string | null {
    return value.trim() ? null : 'Message required';
  }
}
