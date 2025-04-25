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

interface AccountData {
  id: number;
  title: string;
  currentBalance: number;
  income: number;
  expense: number;
}

interface AccountCardProps {
  item: AccountData;
}

const AccountCard: React.FC<AccountCardProps> = ({ item }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);
      //   const total = item.income + item.expense;

      const option: ECOption = {
        series: [
          {
            type: 'pie',
            radius: ['70%', '85%'],
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
              formatter: '{b}  {c}元',
              fontSize: 12,
              color: '#595959',
              lineHeight: 15,
              align: 'center',
              overflow: 'break', // ✅ 防止被裁剪
            },
            labelLine: {
              show: true,

              length: 5, // ✅ 增加长度
              length2: 5, // ✅ 增加第二段长度
              smooth: true,
            },

            data: [
              { value: item.income, name: '收入' },
              { value: item.expense, name: '支出' },
            ],
          },
        ],
        grid: {
          top: 30,
          bottom: 30,
          left: 20,
          right: 20,
        },
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
          <div className="title">当前余额(元)</div>
          <div className="value">¥ {item.currentBalance.toFixed(2)}</div>
        </div>
      </div>

      <div className="card-title">{item.title}</div>
    </div>
  );
};

export default AccountCard;
