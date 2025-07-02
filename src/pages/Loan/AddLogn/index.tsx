import React, { useEffect, useState } from 'react';
import { useModel, history, useSearchParams } from '@umijs/max';
import { Form, InputNumber, DatePicker, Select, Button, Row, Col, Card, message } from 'antd';
import dayjs from 'dayjs';
import LoanDetailTable from './component/LoanDetailTable';
import { LoanInterestService, LoanService } from '@/services';
import useSearchOptions from '@/utils/hooks';

const LoanInterestForm: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [loanDetails, setLoanDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [corporationId, setCorporationId] = useState<string>();

  const { companyList, bankList, selectedCorporationId, setSelectedCorporationId } =
    useSearchOptions();

  const title = id ? '修改贷款利息' : '新增贷款利息';

  const interestTypeOptions = [
    { label: '月', value: '2' },
    { label: '季', value: '3' },
  ];

  const handleCorporationChange = (value: string) => {
    form.setFieldsValue({ bankId: undefined });
    setSelectedCorporationId(value);
  };

  const handleGenerate = async () => {
    const values = await form.validateFields();
    const params = {
      ...values,
      startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
    };
    const res = await LoanService.getLoanData(params);
    setLoanDetails(res.data || []);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const params = {
        ...values,
        startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
      };
      const res = id
        ? await LoanInterestService.updateCompany({ ...params, id })
        : await LoanInterestService.addCompany(params);

      if (res.success) {
        message.success('操作成功');
        history.back();
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (recordId: string) => {
    const res = await LoanInterestService.getCompanyDetailList(recordId);
    if (res?.success) {
      const data = res.data;
      setCorporationId(data.corporationId);
      setSelectedCorporationId(data.corporationId);
      form.setFieldsValue({
        ...data,
        type: String(data.type),
        startDate: dayjs(data.startDate),
        endDate: dayjs(data.endDate),
      });
      setLoanDetails(data.loanInterestDetailsList || []);
    }
  };

  useEffect(() => {
    if (id) fetchDetail(id);
  }, [id]);

  return (
    <Card title={title}>
      <Form form={form} labelCol={{ span: 4 }}>
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item
              label="贷款公司"
              name="corporationId"
              rules={[{ required: true, message: '请选择贷款公司' }]}
            >
              <Select
                showSearch
                options={companyList}
                placeholder="请选择贷款公司"
                onChange={handleCorporationChange}
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="放贷银行"
              name="bankId"
              rules={[{ required: true, message: '请选择银行' }]}
            >
              <Select
                showSearch
                options={bankList}
                placeholder="请选择银行"
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="贷款金额"
              name="loanAmount"
              rules={[
                { required: true, message: '请输入金额' },
                { pattern: /^([1-9]\d*)(\.\d{1,2})?$/, message: '请输入大于0的正确金额' },
              ]}
            >
              <InputNumber style={{ width: '100%' }} suffix="元" precision={2} min={1} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="起始日期"
              name="startDate"
              rules={[
                { required: true, message: '请选择开始日期' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const end = getFieldValue('endDate');
                    if (!value || !end || value.isBefore(end)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('起始日期必须小于结束日期'));
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="结束日期"
              name="endDate"
              rules={[
                { required: true, message: '请选择结束日期' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue('startDate');
                    if (!value || !start || value.isAfter(start)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('结束日期必须大于开始日期'));
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="计息期限"
              name="type"
              rules={[{ required: true, message: '请选择计息期限' }]}
            >
              <Select options={interestTypeOptions} placeholder="请选择计息期限" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="年化利息"
              name="annualInterestRate"
              rules={[{ required: true, message: '请输入利息' }]}
            >
              <InputNumber style={{ width: '100%' }} suffix="%" precision={2} min={0.01} max={99} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Button type="primary" onClick={handleGenerate}>
          生成还款明细
        </Button>
      </div>

      <LoanDetailTable datasource={loanDetails} />

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button onClick={() => history.back()}>返回</Button>
        <Button type="primary" onClick={handleSubmit} style={{ marginLeft: 10 }} loading={loading}>
          保存
        </Button>
      </div>
    </Card>
  );
};

export default LoanInterestForm;
