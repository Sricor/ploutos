import { Client } from "@/lib/http/client";

export class Finance {
  constructor(private readonly client: Client) {}

  async transactionList(page: number) {
    let path = `/finance/currency/transaction`;

    let header = this.client.accesstHeader();
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

  async createTransaction(
    amount: number,
    numeric_code: number,
    remarks: string | null,
    occurrence_at: number | null,
  ) {
    let path = `/finance/currency/transaction`;

    let payload = JSON.stringify({
      amount: amount,
      numeric_code: numeric_code,
      remarks: remarks,
      occurrence_at: occurrence_at,
    });

    let header = this.client.accesstHeader();
    let resp = await this.client.post(path, header, payload);

    type Data = {
      unique: number;
      amount: string;
      numeric_code: number;
      remarks?: string;
      occurrence_at: number;
      created_at: number;
      updated_at: number;
    };

    return this.client.response<Data>(resp);
  }

  async currencyList() {
    let path = `/finance/currency/numeric_code`;

    let header = this.client.defaultHeader();
    let resp = await this.client.get(path, header);

    type Data = {
      code: number;
      symbol: string;
    }[];

    return this.client.response<Data>(resp);
  }
}
