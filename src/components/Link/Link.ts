import { Component } from '../../services/Component'
import template from './link.hbs'
import './link.scss'

interface LinkProps {
  title: string;
  class?: string;
}

export class Link extends Component {
  constructor(props: LinkProps) {
    super('a', {
      class: `link ${props.class || ''}`,
      ...props,
    })
  }

  render() {
    return template(this.props)
  }
}
