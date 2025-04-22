import type { FormInstance } from 'antd';
import { DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd';
import React, { useEffect } from 'react';
import { EnterFormType, OptionsListType } from '../type';
import './index.module.less';

interface AddFormProps {
  form: FormInstance<EnterFormType>;
  id: null | string;
  optionsList: OptionsListType;
}

const AddForm: React.FC<AddFormProps> = ({ form, id, optionsList }) => {
  useEffect(() => {
    if (!!id) {
      const incomeAmount = form.getFieldValue('incomeAmount');
      const expenseAmount = form.getFieldValue('expenseAmount');

      if (incomeAmount && !expenseAmount) {
        form.setFieldsValue({ transactionType: 'income' });
      } else if (!incomeAmount && expenseAmount) {
        form.setFieldsValue({ transactionType: 'expense' });
      }
    }
  }, [id]);

  return (
    <Form form={form} labelCol={{ span: 4 }}>
      <Form.Item
        label="交易日期"
        name="tradeDate"
        rules={[
          {
            required: true,
            message: '请选择交易日期',
          },
        ]}
      >
        <DatePicker placeholder="年 / 月 / 日" style={{ width: '100%' }} allowClear={false} />
      </Form.Item>
      <Form.Item
        label="公司名称"
        name="corporationId"
        rules={[
          {
            required: true,
            message: '请选择公司名称',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          options={optionsList.companyList}
        />
      </Form.Item>
      <Form.Item
        label="对手方名称"
        name="otherCorporationId"
        rules={[
          {
            required: true,
            message: '请选择对手方名称',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          options={optionsList.otherCompanyList}
        />
      </Form.Item>
      <Form.Item
        label="银行名称"
        name="bankId"
        rules={[
          {
            required: true,
            message: '请选择银行名称',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          options={optionsList.bankList}
        />
      </Form.Item>
      <Form.Item
        label="业务类型"
        name="businessTypeId"
        rules={[
          {
            required: true,
            message: '请选择业务类型',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          options={optionsList.businessList}
        />
      </Form.Item>
      <Form.Item
        label="交易类型"
        name="transactionType"
        rules={[
          {
            required: true,
            message: '请选择交易类型',
          },
        ]}
      >
        <Radio.Group>
          <Radio value="income">收入</Radio>
          <Radio value="expense">支出</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="交易金额"
        name="amount"
        rules={[
          {
            required: true,
            message: '请输入交易金额',
          },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="请填写交易金额"
          suffix="元"
          stringMode
          min="0"
          precision={2}
        />
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input.TextArea placeholder="请输入" />
      </Form.Item>
    </Form>
  );
};

export default AddForm;
