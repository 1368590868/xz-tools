import { BankService, OtherCompanyService } from '@/services';
import { ActionType } from '@ant-design/pro-components';
import { Form, Input, message, Modal, Select } from 'antd';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { BankType } from '../../Bank/type';
import { OtherCompanyType } from '../type';

interface Props {
  ref: any;
  actionRef: { current: ActionType | undefined };
}

export interface EditModalRef {
  showModal: (record: OtherCompanyType) => void;
}

const EditModal: React.FC<Props> = React.forwardRef((props, ref) => {
  const { actionRef } = props;
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState<OtherCompanyType>({ id: '', name: '', remark: '' });
  const title = rows.id ? '修改对手方名称' : '新增对手方名称';

  const showModal = (record: OtherCompanyType) => {
    setRows(record);
    setVisible(true);
    form.setFieldsValue(record);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const doUpdate = async () => {
    try {
      const values = await form.validateFields();
      let res;
      if (!rows.id) {
        res = await OtherCompanyService.addCompany(values);
      } else {
        res = await OtherCompanyService.updateCompany({ ...values, id: rows.id });
      }

      if (res.success) {
        message.success('修改成功');
        setVisible(false);
        actionRef.current?.reload(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [bankList, setBankList] = useState<BankType[]>([]);
  const getBankList = async () => {
    const res = await BankService.getBankList<BankType>({ pageSize: 99999, current: 1 });
    console.log(res);
    if (res.success) {
      setBankList(res.data);
    }
  };
  useEffect(() => {
    getBankList();
  }, []);

  return (
    <Modal title={title} open={visible} onOk={doUpdate} onCancel={() => setVisible(false)}>
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          label="公司名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请填写对手方名称',
            },
          ]}
        >
          <Input placeholder="请填写对手方名称" />
        </Form.Item>
        <Form.Item label="银行" name="bankId">
          <Select
            placeholder="请选择银行"
            options={bankList.map((x) => ({ label: x.name, value: x.id }))}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea placeholder="请填写备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default EditModal;
