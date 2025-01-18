import { Client } from "@/library/http/client";

export class Person {
  constructor(private readonly client: Client) {}

  async sign_up() {
    let path = `/person`;

    type Data = {
      timestamp: number;
    };

    return this.client.response<Data>(await this.client.get(path));
  }
}
