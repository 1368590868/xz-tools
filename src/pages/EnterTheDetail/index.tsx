/* eslint-disable no-undef */
import {
  BankService,
  BusinessService,
  CompanyService,
  EnterTheDetailService,
  OtherCompanyService,
} from '@/services';
import { downloadBlobFile } from '@/utils/download';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, message, Popconfirm, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { BankType } from '../Dict/Bank/type';
import { BusinessType } from '../Dict/BusinessType/type';
import { CompanyType } from '../Dict/Company/type';
import { OtherCompanyType } from '../Dict/OtherCompany/type';
import EditModal, { EditModalRef } from './component/EditModal';
import { EnterFormType } from './type';
const EnterTheDetail: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const modalRef = useRef<EditModalRef | null>(null);

  const onDelete = async (id: string) => {
    try {
      const res = await EnterTheDetailService.delete(id);
      if (res.success) {
        message.success('删除成功');
        actionRef.current?.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [companyList, setCompanyList] = React.useState<CompanyType[]>([]);
  const [otherCompanyList, setOtherCompanyList] = React.useState<OtherCompanyType[]>([]);
  const [bankList, setBankList] = React.useState<BankType[]>([]);
  const [businessList, setBusinessList] = React.useState<BusinessType[]>([]);

  const params = {
    pageSize: 99999,
    current: 1,
  };
  const getOptionPromise = [
    CompanyService.getCompanyList<CompanyType>(params),
    OtherCompanyService.getCompanyList<OtherCompanyType>(params),
    BankService.getBankList<BankType>(params),
    BusinessService.getBusinessList<BusinessType>(params),
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
    setOtherCompanyList(
      res[1]?.data?.map((x) => ({
        label: x.name,
        value: x.id,
        ...x,
      })),
    );
    setBankList(
      res[2]?.data?.map((x) => ({
        label: x.name,
        value: x.id,
        ...x,
      })),
    );
    setBusinessList(
      res[3]?.data?.map((x) => ({
        label: x.name,
        value: x.id,
        ...x,
      })),
    );
  };
  const optionsList = {
    companyList,
    otherCompanyList,
    bankList,
    businessList,
  }; // 选项列

  useEffect(() => {
    getOptions();
  }, []);

  useEffect(() => {
    if (!formRef.current?.getFieldValue('tradeDateYear')) {
      formRef.current?.setFieldValue('tradeDateYear', new Date().getFullYear());
    }
  }, []);

  const searchColumns: ProColumns<EnterFormType>[] = [
    {
      title: '年',
      align: 'center',
      dataIndex: 'tradeDateYear',
      hideInTable: true,
      renderFormItem: () => {
        // @ts-ignore
        return <DatePicker.YearPicker allowClear={false} format="YYYY" />;
      },
      initialValue: moment(),
      search: {
        transform: (value: any) => moment(value).format('YYYY'),
      },
    },
    {
      title: '月',
      align: 'center',
      dataIndex: 'tradeDateMonth',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择"
            options={[
              { label: '1月', value: '1' },
              { label: '2月', value: '2' },
              { label: '3月', value: '3' },
              { label: '4月', value: '4' },
              { label: '5月', value: '5' },
              { label: '6月', value: '6' },
              { label: '7月', value: '7' },
              { label: '8月', value: '8' },
              { label: '9月', value: '9' },
              { label: '10月', value: '10' },
              { label: '11月', value: '11' },
              { label: '12月', value: '12' },
            ]}
          />
        );
      },
    },
    {
      title: '公司名称',
      align: 'center',
      dataIndex: 'corporationId',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择"
            options={companyList.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
    },
    {
      title: '银行名称',
      align: 'center',
      dataIndex: 'bankId',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择"
            options={bankList.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
    },
    {
      title: '对手方名称',
      align: 'center',
      dataIndex: 'otherCorporationId',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择"
            options={otherCompanyList.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
    },
    {
      title: '业务类型',
      align: 'center',
      dataIndex: 'businessTypeId',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择"
            options={businessList.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
    },
  ];

  const columns: ProColumns<EnterFormType>[] = [
    ...searchColumns,
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index', // 使用带边框的索引列
      width: 80,
      align: 'center',
      fixed: 'left',
      render: (_, __, index, action) => {
        // 获取当前页码和每页条数
        const { current = 1, pageSize = 10 } = action?.pageInfo || {};

        // 计算序号：(当前页码 - 1) * 每页条数 + 当前行索引 + 1
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: '年',
      align: 'center',
      dataIndex: 'tradeDateYear',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'left',
      width: 60,
    },
    {
      title: '月',
      align: 'center',
      dataIndex: 'tradeDateMonth',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'left',
      width: 60,
    },

    {
      title: '日',
      align: 'center',
      dataIndex: 'tradeDateDay',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'left',
      width: 60,
    },
    {
      title: '公司名称',
      align: 'center',
      dataIndex: 'corporationName',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
    },
    {
      title: '对手方名称',
      align: 'center',
      dataIndex: 'otherCorporationName',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
    },
    {
      title: '银行名称',
      align: 'center',
      dataIndex: 'bankName',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
    },
    {
      title: '业务类型',
      align: 'center',
      dataIndex: 'businessTypeName',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
    },
    {
      title: '收入金额/元',
      align: 'center',
      dataIndex: 'incomeAmount',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
      valueType: 'money',
    },
    {
      title: '支出金额/元',
      align: 'center',
      dataIndex: 'expenseAmount',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
      valueType: 'money',
    },
    {
      width: 150,
      align: 'center',
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => [
        <Button
          type="link"
          key="edit"
          onClick={() => {
            modalRef.current?.showModal(record);
          }}
        >
          修改
        </Button>,
        <Popconfirm
          key={'delete'}
          title="确定删除当前公司名称吗？"
          description=""
          onConfirm={() => onDelete(record.id || '')}
          onCancel={() => {}}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" key="delete" danger>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const onDownload = async () => {
    const formValues = formRef.current?.getFieldsValue();
    const res = await EnterTheDetailService.export({
      ...formValues,
      tradeDateYear: moment(formValues?.tradeDateYear).format('YYYY'),
    });
    if (res.success) {
      // 文件流下载
      downloadBlobFile(res.data, '交易明细表.xlsx');
      message.success('导出成功');
    }
  };

  return (
    <PageContainer>
      <ProTable<EnterFormType, API.PageParams>
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 100,
        }}
        pagination={{
          defaultPageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              modalRef.current?.showModal({
                id: null,
                transactionType: 'income',
              });
            }}
          >
            <PlusOutlined /> 新增交易
          </Button>,
          <Button key="download" onClick={onDownload}>
            <DownloadOutlined /> 下载
          </Button>,
        ]}
        request={EnterTheDetailService.getList<EnterFormType>}
        columns={columns}
        columnEmptyText=""
        bordered
      />

      <EditModal ref={modalRef} actionRef={actionRef} optionsList={optionsList}></EditModal>
    </PageContainer>
  );
};

export default EnterTheDetail;
