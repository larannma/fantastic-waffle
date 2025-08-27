import { Component } from '../../services/Component';
import template from './notFoundPage.hbs';
import './notFoundPage.scss';

export class NotFoundPage extends Component {
  constructor() {
    super('main', {
      class: 'main',
      '.notFoundPage__back-to-chats': {
        click: (e: Event) => this.onBackToChats(e),
      },
    });
  }

  render() {
    return template(this.props);
  }

  private onBackToChats(e: Event) {
    e.preventDefault();
    // Emit custom event for navigation
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'chats' },
      bubbles: true
    }));
  }
}
