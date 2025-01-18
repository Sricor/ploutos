import { Client } from "@/lib/http/client";

export class Person {
  constructor(private readonly client: Client) {}

  async sign_up() {
    let path = `/person`;

    type Data = {
      timestamp: number;
    };

    return this.client.response<Data>(await this.client.post(path));
  }

  async claim(nickname: string, password: string) {
    let path = `/person/claim`;

    let payload = JSON.stringify({
      nickname: nickname,
      password: password,
    });

    let header = this.client.defaultHeader();
    let resp = await this.client.post(path, header, payload);

    type Data = {
      claim: string;
      expire: number;
    };

    return this.client.response<Data>(resp);
  }

  async me() {
    let path = `/`;
  }
}
