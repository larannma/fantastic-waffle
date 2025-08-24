import { Component } from '../../services/Component'
import template from './input.hbs'
import './input.scss'

interface InputProps {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  name?: string;
}

export class Input extends Component {
  constructor(props: InputProps) {
    super('div', {
      class: 'input',
      ...props,
    })
  }

  render() {
    return template(this.props)
  }
}
