import { BankService } from '@/services';
import { ActionType } from '@ant-design/pro-components';
import { Form, Input, InputNumber, message, Modal } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { BankType } from '../type';
import './index.module.less';

interface Props {
  ref: any;
  actionRef: { current: ActionType | undefined };
}

export interface EditModalRef {
  showModal: (record: BankType) => void;
}

const EditModal: React.FC<Props> = React.forwardRef((props, ref) => {
  const { actionRef } = props;
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState<BankType>({ id: '', name: '', remark: '' });
  const title = rows.id ? '修改银行名称' : '新增银行名称';

  const showModal = (record: BankType) => {
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
        res = await BankService.addBank(values);
      } else {
        res = await BankService.updateBank({ ...values, id: rows.id });
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

  return (
    <Modal title={title} open={visible} onOk={doUpdate} onCancel={() => setVisible(false)}>
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          label="银行名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请填写银行名称',
            },
          ]}
        >
          <Input placeholder="请填写银行名称" />
        </Form.Item>
        <Form.Item
          label="期初余额"
          name="initialValue"
          rules={[
            {
              required: true,
              message: '请填写期初余额',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请填写期初余额"
            suffix="元"
            stringMode
            min="0"
            precision={2}
          />
        </Form.Item>
        <Form.Item
          label="银行卡号"
          name="cardNumber"
          // 16 - 19位纯数字
          rules={[
            { pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号', validateTrigger: 'onBlur' },
          ]}
        >
          <Input placeholder="请填写银行卡号" maxLength={19} />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea placeholder="请填写备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default EditModal;
