import Handlebars from "handlebars";

import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";

const pages = {
  0: 'login',
  1: 'register',
  2: 'chat',
  3: 'profile',
  4: 'server_error',
  5: 'not_found_error'
} as const;

type Page = typeof pages[keyof typeof pages];

export default class App {
  state: { currentPage: Page };
  appContainer: HTMLElement;

  constructor(){
    this.state = {
      currentPage: 'login'
    }

    this.appContainer = document.getElementById('app');
  }

  render() {
    let template;
    // here we want to chech the current page and render the current page from the template
    switch (this.state.currentPage){
      case 'login':
        // compiling the login template
        template = Handlebars.compile(LoginPage);
        this.appContainer.innerHTML = template({});
        break;
      case 'register':
        // compiling the register template
        template = Handlebars.compile(RegisterPage);
        this.appContainer.innerHTML = template({});
        break;
        break;
    }
  }
}