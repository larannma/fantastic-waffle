import Handlebars from 'handlebars/runtime';

// helpers
Handlebars.registerHelper('array', function () {
  return new Array(arguments[0]).fill(0).map((_, index) => index);
});

// partials
import { Button } from './components/Button/Button';
import Input from './components/Input/input.hbs';
import Link from './components/Link/link.hbs';
import routes from './components/routes/routes.hbs';

// pages
import chatsPage from './pages/chatsPage/chatsPage.hbs';
import { LoginPage } from './pages/loginPage/LoginPage';

import notFoundPage from './pages/notFoundPage/notFoundPage.hbs';
import profilePage from './pages/profilePage/profilePage.hbs';
import registerPage from './pages/registrationPage/registerPage.hbs';
import serverErrorPage from './pages/serverErrorPage/serverErrorPage.hbs';

Handlebars.registerPartial('Link', Link);

Handlebars.registerPartial('Button', (context) => {
  const btn = new Button({
    ...context,
  });
  return btn.render();
});

Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('routes', routes);

const loginPage = new LoginPage();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pages = {
  0: 'login',
  1: 'register',
  2: 'chats',
  3: 'profile',
  4: 'server_error',
  5: 'not_found_error'
} as const;

type Page = typeof pages[keyof typeof pages];

export default class App {
  state: {
    currentPage: Page
  };
  appContainer: HTMLElement | null;

  constructor(){
    this.state = {
      currentPage: 'login'
    };
    this.appContainer = document.getElementById('app');
  }

  render() {
    switch (this.state.currentPage){
      case 'chats':
        this.appContainer!.innerHTML = chatsPage({});
        break;
      case 'profile':
        this.appContainer!.innerHTML = profilePage({});
        break;
      case 'login':
        this.appContainer!.innerHTML = loginPage.render();
        break;
      case 'register':
        this.appContainer!.innerHTML = registerPage({});
        break;
      case 'server_error':
        this.appContainer!.innerHTML = serverErrorPage({});
        break;
      case 'not_found_error':
        this.appContainer!.innerHTML = notFoundPage({});
        break;
    }
    this.attachEventListeners();
    this.registerRoutes();
  }

  attachEventListeners() {
    switch (this.state.currentPage) {
      case 'login': {
        this.appContainer!.innerHTML = '';
        const loginPage = new LoginPage();
        this.appContainer!.appendChild(loginPage.getContent());
        break;
      }
      
      case 'register': {
        const signInButton = document.querySelector('.register__register-button');
        signInButton?.addEventListener('click', (e) => {
          e.preventDefault();
          this.state.currentPage = 'login';
          this.render();
        });
  
        const goToRegisterButton = document.querySelector('.register__sign-in-link');
        goToRegisterButton?.addEventListener('click', (e) => {
          e.preventDefault();
          this.state.currentPage = 'login';
          this.render();
        });
        break;
      }
  
      case 'not_found_error': {
        const signInButton = document.querySelector('.notFoundPage__back-to-chats');
        signInButton?.addEventListener('click', (e) => {
          e.preventDefault();
          this.state.currentPage = 'chats';
          this.render();
        });
        break;
      }
  
      case 'server_error': {
        const signInButton = document.querySelector('.serverError__back-to-chats');
        signInButton?.addEventListener('click', (e) => {
          e.preventDefault();
          this.state.currentPage = 'chats';
          this.render();
        });
        break;
      }
  
      case 'chats': {
        const profileLink = document.querySelector('.chats__profile-link');
        profileLink?.addEventListener('click', (e) => {
          e.preventDefault();
          this.state.currentPage = 'profile';
          this.render();
        });
  
        const sendMessage = document.querySelector('.chat__send-message-button');
        sendMessage?.addEventListener('click', (e) => {
          e.preventDefault();
        });
        break;
      }
  
      case 'profile': {
        const backButton = document.querySelector('.profile__back-to-chats');
        backButton?.addEventListener('click', (e) => {
          e.preventDefault();
          this.state.currentPage = 'chats';
          this.render();
        });
  
        const saveChanges = document.querySelector('.profile__save-btn');
        saveChanges?.addEventListener('click', (e) => {
          e.preventDefault();
        });
        break;
      }
  
      default:
        break;
    }
  }

  registerRoutes(){
    const notFoundRoute = document.querySelector('.routes__no-found');
    notFoundRoute!.addEventListener('click', () => {
      this.state.currentPage = 'not_found_error';
      this.render();
    });

    const serverErrorRoute = document.querySelector('.routes__server-error');
    serverErrorRoute!.addEventListener('click', () => {
      this.state.currentPage = 'server_error';
      this.render();
    });

    const profileRoute = document.querySelector('.routes__profile');
    profileRoute!.addEventListener('click', () => {
      this.state.currentPage = 'profile';
      this.render();
    });

    const chatsRoute = document.querySelector('.routes__chats');
    chatsRoute!.addEventListener('click', () => {
      this.state.currentPage = 'chats';
      this.render();
    });

    const registerRoute = document.querySelector('.routes__register');
    registerRoute!.addEventListener('click', () => {
      this.state.currentPage = 'register';
      this.render();
    });

    const loginRoute = document.querySelector('.routes__login');
    loginRoute!.addEventListener('click', () => {
      this.state.currentPage = 'login';
      this.render();
    });
  }
}
