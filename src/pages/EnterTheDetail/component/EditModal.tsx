import { EnterTheDetailService } from '@/services';
import { ActionType } from '@ant-design/pro-components';
import { Form, message, Modal, Segmented } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import dayjs from 'dayjs';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { EnterFormType, MultipleRef, OptionsListType, SegmentedType } from '../type';
import AddForm from './AddForm';
import MultipleForm from './MultipleForm';

interface Props {
  ref: any;
  actionRef: { current: ActionType | undefined };
  optionsList: OptionsListType;
}

export interface EditModalRef {
  showModal: (record: EnterFormType) => void;
}

const EditModal: React.FC<Props> = React.forwardRef((props, ref) => {
  const { actionRef } = props;
  const [loading, setLoading] = useState(false);
  const multipleRef = useRef<MultipleRef>(null);
  const [form] = Form.useForm<EnterFormType>();
  const [segmentedType, setSegmentedType] = useState<SegmentedType | SegmentedValue>('single');
  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState<EnterFormType>({
    id: '',
    tradeDate: dayjs(),
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
    // 初始setSegmentedType
    setSegmentedType('single');
    form.resetFields();
    setRows(record);
    setVisible(true);
    form.setFieldsValue({
      ...record,
      tradeDate: dayjs(record.tradeDate),
      amount: record.incomeAmount || record.expenseAmount,
    });
    // 如果有id，则根据金额判断是收入还是支出
    if (!!record.id) {
      const incomeAmount = record.incomeAmount;
      console.log(incomeAmount);

      form.setFieldValue('transactionType', incomeAmount ? 'income' : 'expense');
    }
  };

  const onTabChange = (value: SegmentedValue) => {
    setSegmentedType(value);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const doUpdate = async () => {
    try {
      if (segmentedType === 'multiple') {
        setLoading(true);
        await multipleRef.current?.onOk().then(() => {
          setLoading(false);
          setVisible(false);
          actionRef.current?.reload(true);
        });
        return;
      }
      const values = await form.validateFields();
      const data = {
        ...values,
        tradeDate: dayjs(values.tradeDate).format('YYYY-MM-DD'),
        incomeAmount: values.transactionType === 'income' ? values.amount : null,
        expenseAmount: values.transactionType === 'expense' ? values.amount : null,
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
      confirmLoading={loading}
      onCancel={() => setVisible(false)}
      width={800}
    >
      {!rows.id && (
        <Segmented
          value={segmentedType}
          onChange={onTabChange}
          style={{ marginBottom: 16 }}
          options={[
            { label: '单条新增', value: 'single' },
            { label: '批量导入', value: 'multiple' },
          ]}
        />
      )}

      {segmentedType === 'single' ? (
        <AddForm form={form} optionsList={props.optionsList} />
      ) : (
        <MultipleForm ref={multipleRef} />
      )}
    </Modal>
  );
});

export default EditModal;
