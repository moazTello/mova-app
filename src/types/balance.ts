export type Transaction = {
  id: string;
  amount: string | number;
  type?: string; // credit / debit / payout ...
  note?: string | null;
  description?: string | null;
  created_at: string;
};

export type BalanceInfo = {
  balance: number;
  transactions: Transaction[];
};