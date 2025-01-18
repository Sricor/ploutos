import { Client } from "@/lib/http/client";

export class Health {
  constructor(private readonly client: Client) {}

  async ping() {
    let path = `/ping`;

    type Data = {
      timestamp: number;
    };

    return this.client.response<Data>(await this.client.get(path));
  }
}
