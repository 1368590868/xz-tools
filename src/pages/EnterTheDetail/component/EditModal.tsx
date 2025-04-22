import { EnterTheDetailService } from '@/services';
import { ActionType } from '@ant-design/pro-components';
import { Form, message, Modal, Segmented } from 'antd';
import moment from 'moment';
import React, { useImperativeHandle, useState } from 'react';
import { EnterFormType, EnterTheDetailType, OptionsListType } from '../type';
import AddForm from './AddForm';

interface Props {
  ref: any;
  actionRef: { current: ActionType | undefined };
  optionsList: OptionsListType;
}

export interface EditModalRef {
  showModal: (record: EnterTheDetailType) => void;
}

const EditModal: React.FC<Props> = React.forwardRef((props, ref) => {
  const { actionRef } = props;
  const [form] = Form.useForm<EnterFormType>();

  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState<EnterFormType>({
    id: '',
    tradeDate: moment(),
    transactionType: 'income',
    amount: '',
    remark: '',
    corporationId: '',
    otherCorporationId: '',
    bankId: '',
    businessTypeId: '',
    incomeAmount: '',
    expenseAmount: '',
  });
  const title = rows.id ? '修改交易' : '新增交易';

  const showModal = (record: EnterFormType) => {
    setRows(record);
    setVisible(true);
    form.setFieldsValue({ ...record, tradeDate: moment(record.tradeDate) });
    console.log('record', record);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const doUpdate = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        tradeDate: moment(values.tradeDate).format('YYYY-MM-DD'),
        incomeAmount: values.transactionType === 'income' ? values.amount : '0',
        expenseAmount: values.transactionType === 'expense' ? values.amount : '0',
      };
      let res;
      if (!rows.id) {
        res = await EnterTheDetailService.add(data);
      } else {
        res = await EnterTheDetailService.update({ ...data, id: rows.id });
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
    <Modal
      title={title}
      open={visible}
      onOk={doUpdate}
      onCancel={() => setVisible(false)}
      width={800}
    >
      <Segmented
        options={[
          { label: '单条新增', value: 'single' },
          { label: '批量导入', value: 'multiple' },
        ]}
      />
      <div style={{ height: 10 }}></div>
      <AddForm form={form} id={rows.id} optionsList={props.optionsList} />
    </Modal>
  );
});

export default EditModal;
