import { Client } from "@/lib/http/client";

export class Finance {
  constructor(private readonly client: Client) {}

  async transaction_list(page: number) {
    let path = `/finance/currency/transaction`;

    let header = this.client.accesstHeader();
    console.log(header)
    let resp = await this.client.get(path, header);

    type Data = {
      unique: number;
      amount: string;
      numeric_code: number;
      remarks?: string;
      occurrence_at: number;
      created_at: number;
      updated_at: number;
    }[];

    return this.client.response<Data>(resp);
  }
}
