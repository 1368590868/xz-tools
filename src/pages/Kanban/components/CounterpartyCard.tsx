import type { PieSeriesOption } from 'echarts/charts';
import type {
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';
import * as echarts from 'echarts/core';
import React, { useEffect, useRef } from 'react';
import { OtherType } from '..';

type ECOption = ComposeOption<
  PieSeriesOption | TitleComponentOption | TooltipComponentOption | LegendComponentOption
>;

interface AccountCardProps {
  item: OtherType;
}

const CounterPartyCard: React.FC<AccountCardProps> = ({ item }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);
      //   const total = item.income + item.expense;

      const option: ECOption = {
        series: [
          {
            type: 'pie',
            radius: ['50%', '65%'],
            avoidLabelOverlap: false,

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
              formatter: '{b} \n {c}元',
              fontSize: 12,
              color: '#595959',
              lineHeight: 15,
              align: 'center',
            },
            labelLine: {
              show: true,

              length: 8, // ✅ 增加长度
              length2: 8, // ✅ 增加第二段长度
              smooth: true,
            },

            data: [
              { value: item.incomeAmount, name: '收入' },
              { value: item.expenseAmount, name: '支出' },
            ],
          },
        ],
        grid: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100,
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
          <div className="title">交易笔数</div>
          <div className="value"> {+item.number}</div>
        </div>
      </div>

      <div className="card-title">{item.otherCorporationName}</div>
    </div>
  );
};

export default CounterPartyCard;
