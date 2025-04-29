/* eslint-disable no-undef */
import { BankType } from '@/pages/Dict/Bank/type';
import { BankService, CompanyService, EnterTheDetailService } from '@/services';
import { Button, Col, DatePicker, Form, Row, Select, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
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
          : +value === -1
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
          : +value === -1
          ? ''
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
          : +value === -1
          ? ''
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
          : +value === -1
          ? ''
          : new Intl.NumberFormat('zh-CN', {
              style: 'currency',
              currency: 'CNY',
            }).format(+value);
      },
    },
  ];

  const getBankListAndSetFirstBank = async (corporationId: string) => {
    if (!corporationId) {
      setBankList([]);
      form.setFieldsValue({ bankId: undefined });
      return;
    }
    const res = await BankService.getBankList<BankType>({
      corporationId,
      pageSize: 99999,
      current: 1,
    });
    if (res.success) {
      const list =
        res.data?.map((x) => ({
          label: x.name,
          value: x.id,
          ...x,
        })) || [];
      setBankList(list);
      // ⚡默认选中第一个银行
      if (list.length > 0) {
        form.setFieldsValue({ bankId: list[0].value });
      }
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  };

  const getOptions = async () => {
    const params = {
      pageSize: 99999,
      current: 1,
    };

    const companyRes = await CompanyService.getCompanyList<CompanyType>(params);

    const companyData = companyRes?.data || [];

    const companies = companyData.map((x) => ({
      label: x.name,
      value: x.id,
      ...x,
    }));

    setCompanyList(companies);

    if (companies.length > 0) {
      const firstCompanyId = companies[0].value || '';
      // ⚡默认选第一个公司
      form.setFieldsValue({
        tradeDateYear: dayjs().format('YYYY'),
        corporationId: firstCompanyId,
      });
      // 拿银行列表 + 默认选第一个银行
      await getBankListAndSetFirstBank(firstCompanyId);
    }
  };

  const getTableData = async () => {
    const values = await form.validateFields();
    const res = await EnterTheDetailService.summary({
      ...values,
      tradeDateYear: dayjs(values.tradeDateYear).format('YYYY'),
    });

    const resData = res.data || [];
    // 判断当前搜索年份，如果是当前年份，就只显示到当前月份，超出的月份数据全部转换为0
    const currentYear = dayjs().format('YYYY');
    if (dayjs(values.tradeDateYear).format('YYYY') === currentYear) {
      const currentMonth = dayjs().format('M');

      for (let i = 0; i < resData.length; i++) {
        if (+dayjs(resData[i].month).format('M') > +currentMonth) {
          resData[i].incomeAmount = -1;
          resData[i].expenseAmount = -1;
          resData[i].balance = -1;
          resData[i].initialValue = -1;
        }
      }
    }

    setDatasource(res.data || []);
  };

  const onFormValuesChange = async (changedValues: { corporationId?: string }) => {
    if (changedValues.corporationId) {
      await getBankListAndSetFirstBank(changedValues.corporationId);
      // 🆕 银行选完了之后，自动查一次
      // await getTableData();
    }
  };
  useEffect(() => {
    getOptions().then(() => getTableData());
  }, []);

  return (
    <>
      {/* search form */}
      <Form form={form} onFinish={getTableData} onValuesChange={onFormValuesChange}>
        <Row gutter={[20, 20]}>
          <Col>
            <Form.Item
              label="年份"
              name="tradeDateYear"
              getValueProps={(value) => {
                return {
                  value: value ? dayjs(value, 'YYYY') : undefined,
                };
              }}
            >
              <DatePicker.YearPicker format="YYYY" allowClear={false} maxDate={dayjs()} />
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
                options={bankList}
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
