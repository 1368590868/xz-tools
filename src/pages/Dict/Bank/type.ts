export interface BankType {
  id: string | null;
  name: string;
  cardNumber?: string;
  remark?: string;
  createTime?: string;
  corporationId?: string;
  initialValue?: number;
}
