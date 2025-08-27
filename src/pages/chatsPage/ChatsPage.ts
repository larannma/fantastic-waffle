import { Component } from '../../services/Component';
import template from './chatsPage.hbs';
import './chatsPage.scss';

export class ChatsPage extends Component {
  constructor() {
    super('main', {
      class: 'main',
      '.chats__profile-link': {
        click: (e: Event) => this.onProfileClick(e),
      },
      '.chat__send-message-button': {
        click: (e: Event) => this.onSendMessage(e),
      },
    });
  }

  render() {
    return template(this.props);
  }

  private onProfileClick(e: Event) {
    e.preventDefault();
    // Emit custom event for navigation
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'profile' },
      bubbles: true
    }));
  }

  private onSendMessage(e: Event) {
    e.preventDefault();
    // Handle send message logic
    const input = this.getContent().querySelector('.chat__send-message-input') as HTMLInputElement;
    if (input && input.value.trim()) {
      // Add message sending logic here
      input.value = '';
    }
  }
}
