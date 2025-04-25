import type { PieSeriesOption } from 'echarts/charts';
import type {
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';
import * as echarts from 'echarts/core';
import React, { useEffect, useRef } from 'react';

type ECOption = ComposeOption<
  PieSeriesOption | TitleComponentOption | TooltipComponentOption | LegendComponentOption
>;

interface CounterpartyData {
  id: number;
  title: string;
  transactionCount: number;
  income: number;
  expense: number;
}

interface CounterpartyCardProps {
  item: CounterpartyData;
}

const CounterpartyCard: React.FC<CounterpartyCardProps> = ({ item }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);
      //   const total = item.income + item.expense;

      const option: ECOption = {
        series: [
          {
            type: 'pie',
            radius: ['65%', '85%'],
            avoidLabelOverlap: false,
            startAngle: 90,
            endAngle: -270,
            center: ['50%', '50%'],
            itemStyle: {
              color: (params) => {
                const colorList = ['#4285F4', '#5ECFBA'];
                return colorList[params.dataIndex];
              },
              borderWidth: 0,
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}\n{c}元',
              fontSize: 12,
              color: '#595959',
              lineHeight: 15,
              align: 'center',
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 10,
              smooth: true,
            },
            data: [
              { value: item.income, name: '收入' },
              { value: item.expense, name: '支出' },
            ],
          },
        ],
      };

      chartInstance.setOption(option);

      return () => {
        chartInstance.dispose();
      };
    }
  }, [item]);

  return (
    <div className="finance-card">
      <div className="gauge-container">
        <div ref={chartRef} className="chart-container"></div>
        <div className="gauge-center">
          <div className="title">交易笔数</div>
          <div className="value">{item.transactionCount}</div>
        </div>
      </div>
      <div className="pie-legend">
        <div className="legend-item">
          <div className="color-block income"></div>
          <span className="legend-text">收入</span>
        </div>
        <div className="legend-item">
          <div className="color-block expense"></div>
          <span className="legend-text">支出</span>
        </div>
      </div>
      <div className="finance-details">
        <div className="income">
          <div>收入（元）</div>
          <div className="amount income-color">¥ {item.income.toFixed(2)}</div>
        </div>
        <div className="expense">
          <div>支出（元）</div>
          <div className="amount expense-color">¥ {item.expense.toFixed(2)}</div>
        </div>
      </div>
      <div className="card-title">{item.title}</div>
    </div>
  );
};

export default CounterpartyCard;
