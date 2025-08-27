import { Component } from '../../services/Component';
import template from './button.hbs';

interface ButtonProps {
  label: string;
  type?: string;
  events?: {
    click?: () => void;
  };
}

export class Button extends Component {
  constructor(props: ButtonProps) {
    super('button', props);
  }

  render(): string {
    return template(this.props);
  }
}
