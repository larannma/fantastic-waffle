import Handlebars from "handlebars";

import { registerPage } from "./pages/registrationPage";
import { serverErrorPage } from "./pages/serverErrorPage";
import { notFoundPage } from "./pages/notFoundPage";
import { chatsPage } from "./pages/chatsPage";
import { loginPage } from "./pages/loginnPage";

// helpers
Handlebars.registerHelper('array', function () {
  return new Array(arguments[0]).fill(0).map((_, index) => index);
});

// partials
import { Link } from "./components/Link";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { profilePage } from "./pages/profilePage";
import { routes } from "./components/routes";

Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('routes', routes);

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
    }
    this.appContainer = document.getElementById('app');
  }

  render() {
    let template;
    switch (this.state.currentPage){
      case 'chats':
        template = Handlebars.compile(chatsPage);
        this.appContainer!.innerHTML = template({});
        break;
      case 'profile':
        template = Handlebars.compile(profilePage);
        this.appContainer!.innerHTML = template({});
        break;
      case 'login':
        template = Handlebars.compile(loginPage);
        this.appContainer!.innerHTML = template({});
        break;
      case 'register':
        template = Handlebars.compile(registerPage);
        this.appContainer!.innerHTML = template({});
        break;
      case 'server_error':
        template = Handlebars.compile(serverErrorPage);
        this.appContainer!.innerHTML = template({});
        break;
      case 'not_found_error':
        template = Handlebars.compile(notFoundPage);
        this.appContainer!.innerHTML = template({});
        break;
    }
    this.attachEventListeners()
    this.registerRoutes()
  }

  attachEventListeners() {
    switch (this.state.currentPage) {
      case 'login': {
        const signInButton = document.querySelector('.login__sign-in-button');
        signInButton?.addEventListener('click', (e) => {
          e.preventDefault();
          this.state.currentPage = 'chats';
          this.render();
        });
  
        const goToRegisterButton = document.querySelector('.login__register-link');
        goToRegisterButton?.addEventListener('click', (e) => {
          e.preventDefault();
          this.state.currentPage = 'register';
          this.render();
        });
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
      this.state.currentPage = 'not_found_error'
      this.render()
    })

    const serverErrorRoute = document.querySelector('.routes__server-error');
    serverErrorRoute!.addEventListener('click', () => {
      this.state.currentPage = 'server_error'
      this.render()
    })

    const profileRoute = document.querySelector('.routes__profile');
    profileRoute!.addEventListener('click', () => {
      this.state.currentPage = 'profile'
      this.render()
    })

    const chatsRoute = document.querySelector('.routes__chats');
    chatsRoute!.addEventListener('click', () => {
      this.state.currentPage = 'chats'
      this.render()
    })

    const registerRoute = document.querySelector('.routes__register');
    registerRoute!.addEventListener('click', () => {
      this.state.currentPage = 'register'
      this.render()
    })

    const loginRoute = document.querySelector('.routes__login');
    loginRoute!.addEventListener('click', () => {
      this.state.currentPage = 'login'
      this.render()
    })
  }
}
