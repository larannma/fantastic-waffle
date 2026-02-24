import { Component } from '../../services/Component';
import Router from '../../services/Router';
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
    const router = new Router();
    router.go('/messenger');
  }
}
