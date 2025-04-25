import { Moment } from 'moment';
import { BankType } from '../Dict/Bank/type';
import { BusinessType } from '../Dict/BusinessType/type';
import { CompanyType } from '../Dict/Company/type';
import { OtherCompanyType } from '../Dict/OtherCompany/type';

export interface EnterTheDetailType {
  id: string | null;
  name: string;
  remark?: string;
  createTime?: string;
}

export type TransactionType = 'income' | 'expense';

export interface EnterFormType {
  id: string | null;
  tradeDate?: string | Moment;
  bankId?: string;
  corporationId?: string;
  businessTypeId?: string;
  otherCorporationId?: string;
  incomeAmount?: string | null;
  expenseAmount?: string | null;
  transactionType?: TransactionType;
  amount?: string | null;
  remark?: string;
}

export interface OptionsListType {
  companyList: CompanyType[];
  otherCompanyList: OtherCompanyType[];
  bankList: BankType[];
  businessList: BusinessType[];
}

export type SegmentedType = 'single' | 'multiple';

export interface MultipleRef {
  onOk: () => Promise<void>;
}
