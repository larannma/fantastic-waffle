import { Component } from '../../services/Component';
import template from './button.hbs';

interface ButtonProps {
  label: string;
  type?: string;
  events?: {
    click?: () => void;
  };
  [key: string]: unknown;
}

export class Button extends Component<ButtonProps> {
  constructor(props: ButtonProps) {
    super('button', props);
  }

  render(): string {
    return template(this.props);
  }
}
