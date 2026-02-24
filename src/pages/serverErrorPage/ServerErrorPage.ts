import { Component } from '../../services/Component';
import Router from '../../services/Router';
import template from './serverErrorPage.hbs';
import './serverErrorPage.scss';

export class ServerErrorPage extends Component {
  constructor() {
    super('main', {
      class: 'main',
      '.serverError__back-to-chats': {
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
