import { BusinessService } from '@/services';
import { ActionType } from '@ant-design/pro-components';
import { Form, Input, message, Modal } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { BusinessType } from '../type';

interface Props {
  ref: any;
  actionRef: { current: ActionType | undefined };
}

export interface EditModalRef {
  showModal: (record: BusinessType) => void;
}

const EditModal: React.FC<Props> = React.forwardRef((props, ref) => {
  const { actionRef } = props;
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState<BusinessType>({ id: '', name: '', remark: '' });
  const title = rows.id ? '修改业务类型' : '新增业务类型';

  const showModal = (record: BusinessType) => {
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
        res = await BusinessService.addBusiness(values);
      } else {
        res = await BusinessService.updateBusiness({ ...values, id: rows.id });
      }

      if (res.success) {
        message.success('修改成功');
        setVisible(false);
        actionRef.current?.reload(true);
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal title={title} open={visible} onOk={doUpdate} onCancel={() => setVisible(false)}>
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item
          label="业务类型名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请填写业务类型名称',
            },
          ]}
        >
          <Input placeholder="请填写业务类型名称" />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea placeholder="请填写备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default EditModal;
