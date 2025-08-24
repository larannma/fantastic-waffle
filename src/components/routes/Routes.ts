import { Component } from '../../services/Component'
import template from './routes.hbs'
import './routes.scss'

export class Routes extends Component {
  constructor() {
    super('div', {
      class: 'routes',
      '.routes__no-found': {
        click: () => this.onNotFoundClick(),
      },
      '.routes__server-error': {
        click: () => this.onServerErrorClick(),
      },
      '.routes__profile': {
        click: () => this.onProfileClick(),
      },
      '.routes__chats': {
        click: () => this.onChatsClick(),
      },
      '.routes__register': {
        click: () => this.onRegisterClick(),
      },
      '.routes__login': {
        click: () => this.onLoginClick(),
      },
    })
  }

  render() {
    return template(this.props)
  }

  private onNotFoundClick() {
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'not_found_error' },
      bubbles: true
    }))
  }

  private onServerErrorClick() {
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'server_error' },
      bubbles: true
    }))
  }

  private onProfileClick() {
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'profile' },
      bubbles: true
    }))
  }

  private onChatsClick() {
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'chats' },
      bubbles: true
    }))
  }

  private onRegisterClick() {
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'register' },
      bubbles: true
    }))
  }

  private onLoginClick() {
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'login' },
      bubbles: true
    }))
  }
}
