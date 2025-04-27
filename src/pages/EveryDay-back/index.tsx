import { EnterTheDetailService } from '@/services';
import { downloadBlobFile } from '@/utils/download';
import { PageContainer } from '@ant-design/pro-components';
import type { CalendarProps } from 'antd';
import { Button, Calendar } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import customLocale from './local';

const getMonthData = (value: any) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const EveryDay: React.FC = () => {
  const today = dayjs();

  const handleDownload = async (date: any) => {
    const formatted = date.format('YYYY-MM-DD');
    const res = await EnterTheDetailService.export({
      tradeDate: formatted,
    });
    downloadBlobFile(res.data, `${date.format('YYYY年交易台账-MM月DD日')}.xlsx`);
  };

  const dateCellRender = (value: any) => {
    const isPastOrToday = value.isSame(today, 'day') || value.isBefore(today, 'day');

    const ymText = value.format('YYYY年交易台账-MM月DD日');
    return (
      <div className="custom-cell">
        {isPastOrToday && (
          <Button
            type="link"
            size="small"
            onClick={() => handleDownload(value)}
            style={{ paddingLeft: 0 }}
          >
            {ymText}
          </Button>
        )}
      </div>
    );
  };

  const monthCellRender = (value: any) => {
    const num = getMonthData(value);
    return num ? <div className="notes-month"></div> : null;
  };

  const cellRender: CalendarProps<any>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return (
    <PageContainer>
      <Calendar cellRender={cellRender} showWeek locale={customLocale} />
    </PageContainer>
  );
};

export default EveryDay;
