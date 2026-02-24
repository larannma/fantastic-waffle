enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

interface RequestOptions {
  method: METHOD;
  data?: string | FormData | Document | ArrayBuffer | Blob | Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
}

type RequestOptionsWithoutMethod = Omit<RequestOptions, 'method'>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !(value instanceof FormData) &&
    !(value instanceof ArrayBuffer) &&
    !(value instanceof Blob) &&
    !(value instanceof Document)
  );
}

function queryStringify(data: Record<string, unknown>): string {
  const keys = Object.entries(data);
  if (keys.length === 0) return '';

  return (
    '?' +
    keys
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')
  );
}

export class HTTPTransport {
  get(url: string, options: RequestOptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHOD.GET });
  }

  post(url: string, options: RequestOptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHOD.POST });
  }

  put(url: string, options: RequestOptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHOD.PUT });
  }

  delete(url: string, options: RequestOptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHOD.DELETE });
  }

  request(url: string, options: RequestOptions = { method: METHOD.GET }): Promise<XMLHttpRequest> {
    const { method, data, headers, timeout } = options;

    return new Promise((resolve, reject) => {
      let fullUrl = url;

      if (method === METHOD.GET && data && isPlainObject(data)) {
        fullUrl += queryStringify(data);
      }

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open(method, fullUrl);

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      if (timeout) {
        xhr.timeout = timeout;
      }

      xhr.onload = () => resolve(xhr);
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === METHOD.GET || !data) {
        xhr.send();
      } else if (data instanceof FormData || data instanceof Blob || data instanceof Document) {
        xhr.send(data);
      } else if (typeof data === 'string' || data instanceof ArrayBuffer) {
        xhr.send(data);
      } else if (isPlainObject(data)) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    });
  }
}
