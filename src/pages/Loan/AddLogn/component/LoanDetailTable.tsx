import React from 'react';
import { Table } from 'antd';

const formatter = (val: number) =>
  new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(val);

const columns:any = [
  {
    title: '还款日期',
    dataIndex: 'repayDate',
    align: 'center',
  },
  {
    title: '还款总金额/元',
    dataIndex: 'total',
    align: 'center',
    render: (val: number) => formatter(val),
  },
  {
    title: '利息/元',
    dataIndex: 'repayAmount',
    align: 'center',
    render: (val: number) => formatter(val),
  },
  {
    title: '本金/元',
    dataIndex: 'principalAmount',
    align: 'center',
    render: (val: number) => formatter(val),
  },
];

const LoanDetailTable: React.FC<{ datasource: any[] }> = ({ datasource }) => {
  const summary:any = (data: any[]) => {
    let total = 0, interest = 0, principal = 0;
    data.forEach(item => {
      total += +item.total;
      interest += +item.repayAmount;
      principal += +item.principalAmount;
    });
    return (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} align="center">合计</Table.Summary.Cell>
        <Table.Summary.Cell index={1} align="center">{formatter(total)}</Table.Summary.Cell>
        <Table.Summary.Cell index={2} align="center">{formatter(interest)}</Table.Summary.Cell>
        <Table.Summary.Cell index={3} align="center">{formatter(principal)}</Table.Summary.Cell>
      </Table.Summary.Row>
    );
  };

  return (
    <Table
      columns={columns}
      dataSource={datasource}
      pagination={false}
      bordered
      scroll={{ y: 600 }}
      summary={summary}
      rowKey={(_, index) => String(index)}
    />
  );
};

export default LoanDetailTable;
