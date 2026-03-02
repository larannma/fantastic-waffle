import { expect } from 'chai';

import { HTTPTransport } from './HTTPTransport';

class FakeXMLHttpRequest {
  static instances: FakeXMLHttpRequest[] = [];

  method = '';
  url = '';
  timeout = 0;
  headers: Record<string, string> = {};
  body: unknown;

  onload: (() => void) | null = null;
  onabort: ((error?: unknown) => void) | null = null;
  onerror: ((error?: unknown) => void) | null = null;
  ontimeout: ((error?: unknown) => void) | null = null;

  constructor() {
    FakeXMLHttpRequest.instances.push(this);
  }

  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  send(body?: unknown) {
    this.body = body;
  }

  triggerLoad() {
    this.onload?.();
  }

  triggerError() {
    this.onerror?.(new Error('Network error'));
  }
}

describe('HTTPTransport', () => {
  const originalXHR = globalThis.XMLHttpRequest;

  beforeEach(() => {
    FakeXMLHttpRequest.instances = [];
    (globalThis as unknown as { XMLHttpRequest: typeof FakeXMLHttpRequest }).XMLHttpRequest =
      FakeXMLHttpRequest;
  });

  after(() => {
    (globalThis as unknown as { XMLHttpRequest: typeof XMLHttpRequest }).XMLHttpRequest = originalXHR;
  });

  it('appends query params for GET requests and sends empty body', async () => {
    const transport = new HTTPTransport();
    const request = transport.get('/messages', {
      data: { limit: 20, query: 'hello world' },
    });

    const xhr = FakeXMLHttpRequest.instances[0];
    expect(xhr.method).to.equal('GET');
    expect(xhr.url).to.equal('/messages?limit=20&query=hello%20world');
    expect(xhr.body).to.equal(undefined);

    xhr.triggerLoad();
    const response = await request;

    expect(response).to.equal(xhr as unknown as XMLHttpRequest);
  });

  it('serializes plain object as JSON for POST requests', async () => {
    const transport = new HTTPTransport();
    const request = transport.post('/messages', {
      data: { text: 'Hello' },
    });

    const xhr = FakeXMLHttpRequest.instances[0];
    expect(xhr.method).to.equal('POST');
    expect(xhr.headers['Content-Type']).to.equal('application/json');
    expect(xhr.body).to.equal(JSON.stringify({ text: 'Hello' }));

    xhr.triggerLoad();
    await request;
  });

  it('sends FormData without forcing Content-Type header', async () => {
    const transport = new HTTPTransport();
    const formData = new FormData();
    formData.append('file', 'payload');

    const request = transport.post('/upload', { data: formData });

    const xhr = FakeXMLHttpRequest.instances[0];
    expect(xhr.method).to.equal('POST');
    expect(xhr.headers['Content-Type']).to.equal(undefined);
    expect(xhr.body).to.equal(formData);

    xhr.triggerLoad();
    await request;
  });

  it('rejects promise when xhr emits error', async () => {
    const transport = new HTTPTransport();
    const request = transport.get('/error');

    const xhr = FakeXMLHttpRequest.instances[0];
    xhr.triggerError();

    let isRejected = false;

    try {
      await request;
    } catch {
      isRejected = true;
    }

    expect(isRejected).to.equal(true);
  });
});
