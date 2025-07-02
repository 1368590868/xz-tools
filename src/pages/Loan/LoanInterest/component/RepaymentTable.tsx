

// components/RepaymentTable.tsx
import React from 'react';
import { Table } from 'antd';

// 格式化金额为人民币格式
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY"
  }).format(amount);
};

// 表格列配置
const columns = [
  {
    title: "还款日期",
    dataIndex: "repayDate",
    key: "repayDate",
    align: "center" as const,
  },
  {
    title: "还款总金额/元",
    dataIndex: "total",
    key: "total",
    align: "center" as const,
    render: (_: any, record: any) => {
      return <span>{formatCurrency(record.total)}</span>;
    }
  },
  {
    title: "利息/元",
    dataIndex: "repayAmount",
    key: "repayAmount",
    align: "center" as const,
    render: (_: any, record: any) => {
      return <span>{formatCurrency(record.repayAmount)}</span>;
    }
  },
  {
    title: "本金/元",
    dataIndex: "principalAmount",
    key: "principalAmount",
    align: "center" as const,
    render: (_: any, record: any) => {
      return <span>{formatCurrency(record.principalAmount)}</span>;
    }
  }
];

interface RepaymentTableProps {
  datasource: any[];
}

const RepaymentTable: React.FC<RepaymentTableProps> = ({ datasource }) => {
  return (
    <Table
      columns={columns}
      dataSource={datasource}
      pagination={false}
      bordered={true}
      scroll={{ y: 600 }}
      summary={(data) => {
        let totalAmount = 0;
        let totalInterest = 0;
        let totalPrincipal = 0;

        data.forEach((item) => {
          const total = item.total || 0;
          const repayAmount = item.repayAmount || 0;
          const principalAmount = item.principalAmount || 0;
          
          totalAmount += Number(total);
          totalInterest += Number(repayAmount);
          totalPrincipal += Number(principalAmount);
        });

        return (
          <Table.Summary.Row>
            <Table.Summary.Cell align="center" index={0}>
              合计
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" index={1}>
              {formatCurrency(totalAmount)}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" index={2}>
              {formatCurrency(totalInterest)}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" index={3}>
              {formatCurrency(totalPrincipal)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
      rowKey={(_, index) => String(index)}
    />
  );
};

export default RepaymentTable;