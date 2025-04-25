/* eslint-disable no-undef */
import { BankType } from '@/pages/Dict/Bank/type';
import { BankService, CompanyService, EnterTheDetailService } from '@/services';
import { Button, Col, DatePicker, Form, Row, Select, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { CompanyType } from './type';

// 定义表格数据接口
interface MonthlyData {
  key: string;
  month: string;
  initialValue: string | number;
  income: string | number;
  expense: string | number;
  balance: string | number;
}

const YearCount: React.FC = () => {
  const [form] = Form.useForm();
  const [companyList, setCompanyList] = React.useState<CompanyType[]>([]);
  const [bankList, setBankList] = React.useState<BankType[]>([]);
  // 表格数据
  const [datasource, setDatasource] = useState<MonthlyData[]>([]);

  // 表格列定义
  const columns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
      align: 'center',
      render: (value: string, _: any, index: number) => {
        const count = index >= datasource.length - 4;
        return count ? value : value + '月';
      },
    },
    {
      title: '期初余额',
      dataIndex: 'initialValue',
      key: 'initialValue',
      align: 'center',
      render: (value: string, _: any, index: number) => {
        const count = index >= datasource.length - 4;
        return count
          ? ''
          : new Intl.NumberFormat('zh-CN', {
              style: 'currency',
              currency: 'CNY',
            }).format(+value);
      },
    },
    {
      title: '收入',
      dataIndex: 'incomeAmount',
      key: 'incomeAmount',
      align: 'center',
      render: (value: string, _: any, index: number) => {
        const count = index === datasource.length - 1;
        return count
          ? value + '%'
          : new Intl.NumberFormat('zh-CN', {
              style: 'currency',
              currency: 'CNY',
            }).format(+value);
      },
    },
    {
      title: '支出',
      dataIndex: 'expenseAmount',
      key: 'expenseAmount',
      align: 'center',
      render: (value: string, _: any, index: number) => {
        const count = index === datasource.length - 1;
        return count
          ? value + '%'
          : new Intl.NumberFormat('zh-CN', {
              style: 'currency',
              currency: 'CNY',
            }).format(+value);
      },
    },
    {
      title: '结存',
      dataIndex: 'balance',
      key: 'balance',
      align: 'center',
      render: (value: string, _: any, index: number) => {
        const count = index === datasource.length - 4 || index === datasource.length - 1;
        return count
          ? ''
          : new Intl.NumberFormat('zh-CN', {
              style: 'currency',
              currency: 'CNY',
            }).format(+value);
      },
    },
  ];

  const params = {
    pageSize: 99999,
    current: 1,
  };
  const getOptionPromise = [
    CompanyService.getCompanyList<CompanyType>(params),
    BankService.getBankList<BankType>(params),
  ];
  const getOptions = async () => {
    const res = await Promise.all(getOptionPromise);

    setCompanyList(
      res[0]?.data?.map((x) => ({
        label: x.name,
        value: x.id,
        ...x,
      })),
    );

    setBankList(
      res[1]?.data?.map((x) => ({
        label: x.name,
        value: x.id,
        ...x,
      })),
    );

    // 设置默认值
    form.setFieldsValue({
      tradeDateYear: moment().format('YYYY'),
      corporationId: res[0]?.data[0]?.id,
      bankId: res[1]?.data[0]?.id,
    });

    return Promise.resolve();
  };

  // 获取表格数据
  const getTableData = async () => {
    console.log(form.getFieldsValue());
    const data = await form.validateFields();
    console.log(data, 'data');
    const res = await EnterTheDetailService.summary({
      ...data,
      tradeDateYear: moment(data.tradeDateYear).format('YYYY'),
    });
    setDatasource(res.data);
  };

  useEffect(() => {
    getOptions().then(() => getTableData());
  }, []);

  return (
    <>
      {/* search form */}
      <Form form={form} onFinish={getTableData}>
        <Row gutter={[20, 20]}>
          <Col>
            <Form.Item
              label="年份"
              name="tradeDateYear"
              getValueProps={(value) => {
                return {
                  value: value ? moment(value, 'YYYY') : undefined,
                };
              }}
            >
              <DatePicker.YearPicker format="YYYY" allowClear={false} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="公司" name="corporationId">
              <Select
                style={{ width: 200 }}
                showSearch
                optionFilterProp="label"
                placeholder="请选择"
                options={companyList.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="银行名称" name="bankId">
              <Select
                style={{ width: 200 }}
                showSearch
                optionFilterProp="label"
                placeholder="请选择"
                options={bankList.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        columns={columns as ColumnType<MonthlyData>[]}
        dataSource={datasource}
        pagination={false}
        bordered
        size="middle"
        className="year-count-table"
      />
    </>
  );
};

export default YearCount;
