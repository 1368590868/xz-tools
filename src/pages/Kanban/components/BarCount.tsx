import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import React, { useEffect, useRef } from 'react';
import { OtherType } from '..';

import { Card } from 'antd';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

interface BarCountProps {
  data: OtherType[];
}

const BarCount: React.FC<BarCountProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);
      console.log(data, ' res data ');
      // 准备数据
      const businessTypes = data.map((item) => item.businessTypeName);
      const incomeData = data.map((item) => +item.incomeAmount);
      const expenseData = data.map((item) => +item.expenseAmount);

      const option = {
        title: {
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (params: any) {
            const incomeItem = params[0];
            const expenseItem = params[1];
            return `${incomeItem.name}<br/>
                    ${incomeItem.seriesName}: ${incomeItem.value}元<br/>
                    ${expenseItem.seriesName}: ${expenseItem.value}元`;
          },
        },
        legend: {
          data: ['收入', '支出'],
          top: 30,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: businessTypes,
          axisLabel: {
            interval: 0,
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          name: '金额（元）',
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            name: '收入',
            type: 'bar',
            barWidth: 30,
            emphasis: {
              focus: 'series',
            },
            data: incomeData,
            itemStyle: {
              color: '#4285F4',
            },

            label: {
              show: true,
              position: 'top',
              formatter: function (params: any) {
                return params.value > 0 ? params.value : '';
              },
            },
          },
          {
            name: '支出',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            barWidth: 30,
            data: expenseData,
            itemStyle: {
              color: '#5ECFBA',
            },
            label: {
              show: true,
              position: 'top',
              formatter: function (params: any) {
                return params.value > 0 ? params.value : '';
              },
            },
          },
        ],
      };

      chartInstance.setOption(option);

      // 响应式调整
      const handleResize = () => {
        chartInstance.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.dispose();
      };
    }
  }, [data]);

  return (
    <Card className="bar-chart-card">
      <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
    </Card>
  );
};

export default BarCount;
