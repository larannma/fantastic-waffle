import Handlebars from "handlebars";

import { registerPage } from "./pages/registerPage";
import { loginPage } from "./pages/loginPage";
import { serverErrorPage } from "./pages/serverErrorPage";
import { notFoundPage } from "./pages/notFoundPage";
import { chatsPage } from "./pages/chatsPage";

// helpers
Handlebars.registerHelper('array', function () {
  return new Array(arguments[0]).fill(0).map((_, index) => index);
});

// partials
import { Link } from "./components/Link";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { profilePage } from "./pages/profilePage";

Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);

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
  appContainer: HTMLElement;

  constructor(){
    this.state = {
      currentPage: 'chats'
    }
    this.appContainer = document.getElementById('app');
  }

  render() {
    let template;
    switch (this.state.currentPage){
      case 'chats':
        template = Handlebars.compile(chatsPage);
        this.appContainer.innerHTML = template({});
        break;
      case 'profile':
        template = Handlebars.compile(profilePage);
        this.appContainer.innerHTML = template({});
        break;
      case 'login':
        template = Handlebars.compile(loginPage);
        this.appContainer.innerHTML = template({});
        break;
      case 'register':
        template = Handlebars.compile(registerPage);
        this.appContainer.innerHTML = template({});
        break;
      case 'server_error':
        template = Handlebars.compile(serverErrorPage);
        this.appContainer.innerHTML = template({});
        break;
      case 'not_found_error':
        template = Handlebars.compile(notFoundPage);
        this.appContainer.innerHTML = template({});
        break;
    }
    this.attachEventListeners()
  }

  attachEventListeners(){
    if (this.state.currentPage === 'login'){

    }
  }
}