import { expect } from 'chai';

import { Routes } from './Routes';

describe('Routes', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('dispatches navigate event with expected page for each route item', () => {
    const routes = new Routes();
    document.body.appendChild(routes.getContent());

    const cases = [
      ['.routes__no-found', 'not_found_error'],
      ['.routes__server-error', 'server_error'],
      ['.routes__profile', 'profile'],
      ['.routes__chats', 'chats'],
      ['.routes__register', 'register'],
      ['.routes__login', 'login'],
    ] as const;

    const receivedPages: string[] = [];

    routes.getContent().addEventListener('navigate', (event: Event) => {
      const customEvent = event as CustomEvent<{ page: string }>;
      receivedPages.push(customEvent.detail.page);
    });

    for (const [selector, expectedPage] of cases) {
      const routeElement = routes.getContent().querySelector(selector) as HTMLElement | null;
      expect(routeElement, `Route element ${selector} should exist`).to.not.equal(null);

      routeElement!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(receivedPages.at(-1)).to.equal(expectedPage);
    }
  });
});
