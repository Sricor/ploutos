import { Person } from "@/lib/http/api/person";
import { HTTPClient } from "@/lib/http/http";
import { Health } from "@/lib/http/api/health";
import { Finance } from "./api/finance";

export class Client extends HTTPClient {
  #claim?: string;

  public set claim(value: string) {
    this.#claim = value;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:80");
  }

  public defaultHeader() {
    return {
      ...{ "Content-Type": "application/json" },
    };
  }

  public accesstHeader() {
    return {
      ...{ "X-Access-Cliam": this.#claim ?? "" },
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
      ok: boolean;
      code: number;
      message: string | null;
      data: T;
    };

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
  person = new Person(this);
  finance = new Finance(this);
}
