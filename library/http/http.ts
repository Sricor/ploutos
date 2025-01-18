export abstract class HTTPClient {
  constructor(public api: string) {}

  protected request = (
    method: string,
    path: string,
    headers?: HeadersInit,
    body?: BodyInit,
  ) => {
    return fetch(`${this.api}${path}`, {
      method: method,
      headers: headers,
      body: body,
    });
  };
}
