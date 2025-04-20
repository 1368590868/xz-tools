import { CompanyService } from '@/services';
import { ActionType } from '@ant-design/pro-components';
import { Form, Input, message, Modal } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { CompanyType } from '../type';

interface Props {
  ref: any;
  actionRef: { current: ActionType | undefined };
}

export interface EditModalRef {
  showModal: (record: CompanyType) => void;
}

const EditModal: React.FC<Props> = React.forwardRef((props, ref) => {
  const { actionRef } = props;
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState<CompanyType>({ id: '', name: '', remark: '' });

  const showModal = (record: CompanyType) => {
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
        res = await CompanyService.addCompany(values);
      } else {
        res = await CompanyService.updateCompany(rows.id, values);
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
    <Modal title="修改公司名称" open={visible} onOk={doUpdate} onCancel={() => setVisible(false)}>
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          label="公司名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请填写公司名称',
            },
          ]}
        >
          <Input placeholder="请填写公司名称" />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea placeholder="请填写备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default EditModal;
