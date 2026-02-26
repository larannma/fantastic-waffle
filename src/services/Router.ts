import AuthStore from './AuthStore';
import { Component } from './Component';

export type RouteProps = {
  rootQuery?: string;
};

type RouteClass = new (props?: RouteProps) => Component<any>;
type RouteGuard = {
  requireAuth?: boolean;
  guestOnly?: boolean;
};

export class Route {
  private _pathname: string;
  private _blockClass: RouteClass;
  private _block: Component | null = null;
  private _props: RouteProps;
  private _guard: RouteGuard;

  constructor(pathname: string, view: RouteClass, props: RouteProps = {}, guard: RouteGuard = {}) {
    this._pathname = pathname;
    this._blockClass = view;
    this._props = props;
    this._guard = guard;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.destroy();
      this._block.getContent().remove();
      this._block = null;
    }
  }

  match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  getGuard(): RouteGuard {
    return this._guard;
  }

  render(pathname?: string) {
    if (!this.match(pathname || this._pathname)) {
      return;
    }

    const rootQuery = this._props.rootQuery || '#app';
    const root = document.querySelector(rootQuery);

    if (!root) {
      throw new Error(`Root element with selector "${rootQuery}" not found`);
    }

    this.leave();

    this._block = new this._blockClass(this._props);
    root.innerHTML = '';
    root.appendChild(this._block.getContent());
  }
}

class Router {
  private static __instance: Router;
  private routes: Route[] = [];
  private history: History = window.history;
  private _currentRoute: Route | null = null;
  private _rootQuery: string = '#app';

  constructor(rootQuery: string = '#app') {
    if (Router.__instance) {
      return Router.__instance;
    }

    this._rootQuery = rootQuery;
    Router.__instance = this;
  }

  use(pathname: string, block: RouteClass, guard: RouteGuard = {}) {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery }, guard);
    this.routes.push(route);
    return this;
  }

  async start() {
    window.onpopstate = (event: PopStateEvent) => {
      const target = event.currentTarget as Window;
      void this._onRoute(target.location.pathname);
    };

    await this._onRoute(window.location.pathname);
  }

  async _onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    const isAuthenticated = await AuthStore.checkAuth();
    const fallbackPath = isAuthenticated ? '/messenger' : '/';

    if (!route) {
      if (pathname !== fallbackPath) {
        this.go(fallbackPath, true);
      }
      return;
    }

    const { requireAuth = false, guestOnly = false } = route.getGuard();

    if (requireAuth && !isAuthenticated) {
      if (pathname !== '/') {
        this.go('/', true);
      }
      return;
    }

    if (guestOnly && isAuthenticated) {
      if (pathname !== '/messenger') {
        this.go('/messenger', true);
      }
      return;
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render(pathname);
  }

  go(pathname: string, replace: boolean = false) {
    if (replace) {
      this.history.replaceState({}, '', pathname);
    } else if (window.location.pathname !== pathname) {
      this.history.pushState({}, '', pathname);
    }

    void this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}

export default Router;
