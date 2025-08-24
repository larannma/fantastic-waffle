import Handlebars from 'handlebars/runtime'

// helpers
Handlebars.registerHelper('array', function () {
  return new Array(arguments[0]).fill(0).map((_, index) => index)
})

// components
import { Button } from './components/Button/Button'
import { Input } from './components/Input/Input'
import { Link } from './components/Link/Link'
import { Routes } from './components/routes/Routes'

// pages
import { ChatsPage } from './pages/chatsPage/ChatsPage'
import { LoginPage } from './pages/loginPage/LoginPage'
import { NotFoundPage } from './pages/notFoundPage/NotFoundPage'
import { ProfilePage } from './pages/profilePage/ProfilePage'
import { RegisterPage } from './pages/registrationPage/RegisterPage'
import { ServerErrorPage } from './pages/serverErrorPage/ServerErrorPage'

Handlebars.registerPartial('Link', (context) => {
  const link = new Link({
    ...context,
  })
  return link.render()
})

Handlebars.registerPartial('Button', (context) => {
  const btn = new Button({
    ...context,
  })
  return btn.render()
})

Handlebars.registerPartial('Input', (context) => {
  const input = new Input({
    ...context,
  })
  return input.render()
})

type Page = 'login' | 'register' | 'chats' | 'profile' | 'server_error' | 'not_found_error';

export default class App {
  private state: {
    currentPage: Page
  }
  private appContainer: HTMLElement | null
  private currentPageInstance: any = null
  private routesComponent: Routes

  constructor(){
    this.state = {
      currentPage: 'login'
    }
    this.appContainer = document.getElementById('app')
    this.routesComponent = new Routes()
  }

  init() {
    this.render()
    this.attachEventListeners()
    this.registerRoutes()
    this.setupGlobalNavigation()
  }

  private render() {
    if (!this.appContainer) return

    // Clean up previous page instance
    if (this.currentPageInstance) {
      this.currentPageInstance.hide()
    }

    // Create new page instance
    this.currentPageInstance = this.createPageInstance(this.state.currentPage)
    
    // Clear container and append new page and routes
    this.appContainer.innerHTML = ''
    this.appContainer.appendChild(this.currentPageInstance.getContent())
    this.appContainer.appendChild(this.routesComponent.getContent())
  }

  private createPageInstance(page: Page) {
    switch (page) {
      case 'login':
        return new LoginPage()
      case 'register':
        return new RegisterPage()
      case 'chats':
        return new ChatsPage()
      case 'profile':
        return new ProfilePage()
      case 'not_found_error':
        return new NotFoundPage()
      case 'server_error':
        return new ServerErrorPage()
      default:
        return new LoginPage()
    }
  }

  private attachEventListeners() {

  }

  private setupGlobalNavigation() {
    document.addEventListener('navigate', (e: Event) => {
      const customEvent = e as CustomEvent
      const { page } = customEvent.detail
      if (page && this.state.currentPage !== page) {
        this.state.currentPage = page
        this.render()
      }
    })
  }

  private registerRoutes(){
    const notFoundRoute = document.querySelector('.routes__no-found')
    notFoundRoute?.addEventListener('click', () => {
      this.state.currentPage = 'not_found_error'
      this.render()
    })

    const serverErrorRoute = document.querySelector('.routes__server-error')
    serverErrorRoute?.addEventListener('click', () => {
      this.state.currentPage = 'server_error'
      this.render()
    })

    const profileRoute = document.querySelector('.routes__profile')
    profileRoute?.addEventListener('click', () => {
      this.state.currentPage = 'profile'
      this.render()
    })

    const chatsRoute = document.querySelector('.routes__chats')
    chatsRoute?.addEventListener('click', () => {
      this.state.currentPage = 'chats'
      this.render()
    })

    const registerRoute = document.querySelector('.routes__register')
    registerRoute?.addEventListener('click', () => {
      this.state.currentPage = 'register'
      this.render()
    })

    const loginRoute = document.querySelector('.routes__login')
    loginRoute?.addEventListener('click', () => {
      this.state.currentPage = 'login'
      this.render()
    })
  }
}
