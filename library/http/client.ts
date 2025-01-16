import { HTTPClient } from "./http"

import { Health } from "@/library/http/api/health";

export class Client extends HTTPClient {
  constructor() {
    super("https://api.ioaths.com");
  }

  public defaultHeader() {
    return {
      ...{ "Content-Type": "application/json" },
    };
  }

  public get = (path: string, headers?: HeadersInit, body?: BodyInit) => {
    return this.request("GET", path, headers, body);
  };

  public post = (path: string, headers?: HeadersInit, body?: BodyInit) => {
    return this.request("POST", path, headers, body);
  };

  public response = async <T>(response: Response): Promise<T> => {
    type APIResponse<T> = {
      ok: boolean,
      code: number,
      message: string | null,
      data: T
    }

    try {
      let resp: APIResponse<T> = await response.json();

      if (!resp.ok) {
        throw new Error(resp.message || "Unknown error occurred");
      }

      return resp.data;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Invalid JSON response from server");
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  };

  health = new Health(this);
}

export const client = new Client();
