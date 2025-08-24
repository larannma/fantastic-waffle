export class EventBus {
  private events:  Record<string, (() => void)[]>
  
  constructor() {
    this.events = {}
  }

  _hasEvent(eventName: string){
    return eventName in this.events
  }

  on(eventName: string, callback: () => void) {
    if (!this._hasEvent(eventName)){
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  };

  off(eventName: string, callback: () => void){
    if (!this._hasEvent(eventName)){
      return
    }
    this.events[eventName].filter((fn) => fn !== callback)
  }

  emit(eventName: string) {
    if(this._hasEvent(eventName)){
      this.events[eventName].forEach((fn) => {
        fn()
      })
    }
  }
}
