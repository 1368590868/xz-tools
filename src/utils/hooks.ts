import { useEffect, useState } from 'react';
import { CompanyService, BankService } from '@/services';

const useSearchOptions = () => {
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [bankList, setBankList] = useState<any[]>([]);
  const [selectedCorporationId, setSelectedCorporationId] = useState<string | undefined>();

  useEffect(() => {
    CompanyService.getCompanyList({ current: 1, pageSize: 99999 }).then((res) => {
      if (res?.data) {
        const list = res.data.map((item: any) => ({
          label: item.name,
          value: item.id,
          ...item,
        }));
        setCompanyList(list);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedCorporationId) {
      setBankList([]);
      return;
    }
    BankService.getBankList({
      corporationId: selectedCorporationId,
      current: 1,
      pageSize: 99999,
    }).then((res) => {
      if (res?.success) {
        const list = res.data?.map((item: any) => ({
          label: item.name,
          value: item.id,
          ...item,
        }));
        setBankList(list || []);
      }
    });
  }, [selectedCorporationId]);

  return {
    companyList,
    bankList,
    selectedCorporationId,
    setSelectedCorporationId,
  };
};

export default useSearchOptions;