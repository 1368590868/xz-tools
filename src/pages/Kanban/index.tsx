import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, DatePicker, Row } from 'antd';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import React, { useState } from 'react';
import AccountCard from './components/AccountCard';
import CounterpartyCard from './components/CounterpartyCard';
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
interface AccountData {
  id: number;
  title: string;
  currentBalance: number;
  income: number;
  expense: number;
}

// 对手方数据类型
interface CounterpartyData {
  id: number;
  title: string;
  transactionCount: number;
  income: number;
  expense: number;
}

const KanbanPage: React.FC = () => {
  // 日期范围状态
  const [dateRange, setDateRange] = useState<[any, any]>([null, null]);

  // 账户数据示例
  const accountData: AccountData[] = [
    {
      id: 1,
      title: '公司-银行',
      currentBalance: 9000.0,
      income: 26888.88,
      expense: 1888.88,
    },
    {
      id: 2,
      title: '公司-银行',
      currentBalance: 9000.0,
      income: 26888.88,
      expense: 1888.88,
    },
    {
      id: 3,
      title: '公司-银行',
      currentBalance: 9000.0,
      income: 26888.88,
      expense: 1888.88,
    },
  ];

  // 对手方数据示例
  const counterpartyData: CounterpartyData[] = [
    {
      id: 1,
      title: '对手方名称',
      transactionCount: 18,
      income: 26888.88,
      expense: 1888.88,
    },
    {
      id: 2,
      title: '对手方名称',
      transactionCount: 18,
      income: 26888.88,
      expense: 1888.88,
    },
    {
      id: 3,
      title: '对手方名称',
      transactionCount: 18,
      income: 26888.88,
      expense: 1888.88,
    },
  ];

  return (
    <PageContainer>
      <Card>
        <div className="filter-bar">
          <Row gutter={16} align="middle">
            <Col>
              <RangePicker
                placeholder={['开始日期', '结束日期']}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            </Col>
            <Col>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
            </Col>
            <Col>
              <Button icon={<ReloadOutlined />}>重置</Button>
            </Col>
          </Row>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">账户收支看板</h2>
          <div className="carousel-container">
            <div className="carousel-slide">
              <Row gutter={24}>
                {accountData.map((item) => (
                  <Col span={8} key={item.id}>
                    <AccountCard item={item} />
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">与对手方收支看板</h2>
          <div className="carousel-container">
            <div className="carousel-slide">
              <Row gutter={24}>
                {counterpartyData.map((item) => (
                  <Col span={8} key={item.id}>
                    <CounterpartyCard item={item} />
                  </Col>
                ))}
              </Row>
            </div>
          </div>
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
