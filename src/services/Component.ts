/* eslint-disable no-undef */
import { EventBus } from './EventBus'

interface IEvents {
  INIT: string;
  FLOW_CDM: string;
  FLOW_RENDER: string;
  FLOW_CDU: string;
}

interface IMeta {
  tagName: string;
  props: Record<string, any>;
}

export class Component {
  private static EVENTS: IEvents = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_RENDER: 'flow:render',
    FLOW_CDU: 'flow:component-did-update',
  }

  private _element: HTMLElement | null = null
  private _meta: IMeta
  private _eventBus: () => EventBus
  protected props: Record<string, any>

  constructor(tagName = 'div', props = {}) {
    const eventBus = new EventBus()

    this._meta = {
      tagName,
      props,
    }

    this.props = this._makePropsProxy(props)
    this._eventBus = () => eventBus

    this._registerEvents(eventBus)
    eventBus.emit(Component.EVENTS.INIT)
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Component.EVENTS.INIT, this.init.bind(this))
    eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
    eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this))
    eventBus.on(Component.EVENTS.FLOW_CDU, this._render.bind(this))
  }

  private _createResources() {
    const { tagName } = this._meta
    this._element = this._createDocumentElement(tagName)
  }

  protected init() {
    this._createResources()
    this._eventBus().emit(Component.EVENTS.FLOW_RENDER)
  }

  private _componentDidMount() {
    this.componentDidMount()
  }

  // Может переопределяться в наследниках
  componentDidMount() {}

  dispatchComponentDidMount() {
    this._eventBus().emit(Component.EVENTS.FLOW_CDM)
  }

  private _componentDidUpdate = (oldProps: any, newProps: any) => {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps)
    if (shouldUpdate) {
      this._eventBus().emit(Component.EVENTS.FLOW_CDU)
      this._eventBus().emit(Component.EVENTS.FLOW_RENDER)
    }
  }

  // Может переопределяться в наследниках
  componentDidUpdate(oldProps: any, newProps: any) {
    const keys = Object.keys(newProps)

    for (let key of keys) {
      if (oldProps[key] !== newProps[key]) {
        return true
      }
    }
    return false
  }

  setProps = (nextProps: Record<string, any>) => {
    if (!nextProps) {
      return
    }
    Object.assign(this.props, nextProps)
  }

  get element() {
    return this._element
  }

  private _render() {
    const block = this.render()
    if (this._element) {
      this._removeEvents()
      this._element.innerHTML = block
      this._setAttributes()
      this._addEvents()
      this._componentDidMount()
    }
  }

  // Должен переопределяться в наследниках
  render(): string {
    return ''
  }

  getContent() {
    return this._element!
  }

  private _makePropsProxy(props: Record<string, any>) {
    const self = this

    return new Proxy(props, {
      set(target, prop: string, value) {
        const oldProps = { ...target }
        target[prop] = value
        self._componentDidUpdate(oldProps, target)
        return true
      },
      deleteProperty() {
        throw new Error('Нет доступа')
      },
    })
  }

  private _createDocumentElement(tagName: string) {
    const elem = document.createElement(tagName)
    return elem
  }

  private _addEvents() {
    const events = this.props
    if (!this._element) return

    Object.entries(events).forEach(([selector, eventMap]) => {
      if (typeof eventMap === 'object') {
        const elements = this._element!.querySelectorAll(selector)
        elements.forEach((el) => {
          Object.entries(eventMap as Record<string, EventListener>).forEach(([event, handler]) => {
            el.addEventListener(event, handler)
          })
        })
      }
    })
  }

  private _removeEvents() {
    const events = this.props
    if (!this._element) return

    Object.entries(events).forEach(([selector, eventMap]) => {
      if (typeof eventMap === 'object') {
        const elements = this._element!.querySelectorAll(selector)
        elements.forEach((el) => {
          Object.entries(eventMap as Record<string, EventListener>).forEach(([event, handler]) => {
            el.removeEventListener(event, handler)
          })
        })
      }
    })
  }

  private _setAttributes() {
  Object.entries(this.props).forEach(([key, value]) => {
    if (typeof value !== 'object') {
      if (key === 'class') {
        this._element!.className = value as string
      } else {
        this._element!.setAttribute(key, value as string)
      }
    }
  })
}

  show() {
    if (this._element) this._element.style.display = 'block'
  }

  hide() {
    if (this._element) this._element.style.display = 'none'
  }
}
