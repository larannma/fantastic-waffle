import Handlebars from 'handlebars/runtime';

// хелперы
Handlebars.registerHelper('array', function () {
  return new Array(arguments[0]).fill(0).map((_, index) => index);
});

Handlebars.registerHelper('gt', function (a, b) {
  return a > b;
});

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

// компоненты
import { Button } from './components/Button/Button';
import { Input } from './components/Input/Input';
import { Link } from './components/Link/Link';

// страницы
import { ChatsPage } from './pages/chatsPage/ChatsPage';
import { LoginPage } from './pages/loginPage/LoginPage';
import { ProfilePage } from './pages/profilePage/ProfilePage';
import { RegisterPage } from './pages/registrationPage/RegisterPage';

// сервисы
import Router from './services/Router';

Handlebars.registerPartial('Link', (context) => {
  const link = new Link({
    ...context,
  });
  return link.render();
});

Handlebars.registerPartial('Button', (context) => {
  const btn = new Button({
    ...context,
  });
  return btn.render();
});

Handlebars.registerPartial('Input', (context) => {
  const input = new Input({
    ...context,
  });
  return input.render();
});

export default class App {
  private router: Router;

  constructor() {
    this.router = new Router('#app');
  }

  init() {
    this.router
      .use('/', LoginPage, { guestOnly: true })
      .use('/sign-up', RegisterPage, { guestOnly: true })
      .use('/settings', ProfilePage, { requireAuth: true })
      .use('/messenger', ChatsPage, { requireAuth: true });

    this.router.start();
  }
}
