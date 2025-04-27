import { EnterTheDetailService } from '@/services';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, DatePicker, Empty, Row } from 'antd';
import dayjs from 'dayjs';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import React, { useEffect, useState } from 'react';
import AccountCard from './components/AccountCard';
import BarCount from './components/BarCount';
import CounterPartyCard from './components/CounterpartyCard';
import YearCount from './components/YearCount';
import './index.less';

const { RangePicker } = DatePicker;

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

// 账户数据类型
export interface AccountData {
  id: number;
  title: string;
  bankName: string;
  corporationName: string;
  balance: number;
  incomeAmount: number;
  expenseAmount: number;
}

// 对手方数据类型
export interface OtherType {
  otherCorporationName: string;
  title: string;
  expenseAmount: number;
  incomeAmount: number;
  expense: number;
  total: number;
  businessTypeName: string;
  number: number;
}

const KanbanPage: React.FC = () => {
  // 日期范围状态
  const [dateRange, setDateRange] = useState<[any, any]>([
    dayjs().startOf('year'),
    dayjs(dayjs(), 'YYYY-MM-DD'),
  ]);

  // 账户数据示例
  const [accountData, setAccountData] = useState<AccountData[]>([]);

  // 对手方数据示例
  const [otherData, setOtherData] = useState<OtherType[]>([]);

  //   柱状图
  const [barData, setBarData] = useState<any>([]);

  const getBardData = async () => {
    console.log('dateRange', dateRange);
    const startDate = dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : '';
    const endDate = dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : '';
    const params = {
      startDate,
      endDate,
    };
    const service = [
      EnterTheDetailService.getBudgetData(params),
      EnterTheDetailService.getExpenditureData(params),
      EnterTheDetailService.getBusinessTypeData(params),
    ];
    const res = await Promise.all(service);
    setAccountData(res[0].data);
    setOtherData(res[1].data);
    setBarData(res[2].data);
  };

  useEffect(() => {
    getBardData();
  }, []);

  const onSearch = () => {
    getBardData();
  };
  const onRest = async () => {
    setDateRange([dayjs().startOf('year'), dayjs(dayjs(), 'YYYY-MM-DD')]);

    const startDate = dayjs().startOf('year').format('YYYY-MM-DD');
    const endDate = dayjs().format('YYYY-MM-DD');
    const params = {
      startDate,
      endDate,
    };
    const service = [
      EnterTheDetailService.getBudgetData(params),
      EnterTheDetailService.getExpenditureData(params),
      EnterTheDetailService.getBusinessTypeData(params),
    ];
    const res = await Promise.all(service);
    setAccountData(res[0].data);
    setOtherData(res[1].data);
    setBarData(res[2].data);
  };

  return (
    <PageContainer>
      <Card>
        <div className="filter-bar">
          <Row gutter={16} align="middle">
            <Col>
              <RangePicker
                placeholder={['开始日期', '结束日期']}
                value={dateRange}
                onChange={(dates) => {
                  setDateRange(dates);
                }}
              />
            </Col>
            <Col>
              <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
                查询
              </Button>
            </Col>
            <Col>
              <Button onClick={onRest} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Col>
          </Row>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">账户收支看板</h2>
          <div className="carousel-container">
            <div className="carousel-slide">
              <div style={{ display: 'flex', gap: 30, overflowX: 'scroll' }}>
                {accountData && accountData.length > 0 ? (
                  accountData.map((item, idx) => (
                    <div key={idx}>
                      <AccountCard item={item} />
                    </div>
                  ))
                ) : (
                  <div>
                    <Empty description="暂无数据" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">与对手方收支看板</h2>
          <div className="carousel-container">
            <div className="carousel-slide">
              <div style={{ display: 'flex', gap: 30, overflowX: 'scroll' }}>
                {otherData && otherData.length > 0 ? (
                  otherData.map((item, idx) => (
                    <div key={idx}>
                      <CounterPartyCard item={item} />
                    </div>
                  ))
                ) : (
                  <div>
                    <Empty description="暂无数据" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">业务类型收支前10看板</h2>
          <BarCount data={barData} />
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">年度汇总</h2>

          <YearCount />
        </div>
      </Card>
    </PageContainer>
  );
};

export default KanbanPage;
