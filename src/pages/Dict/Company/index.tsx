/* eslint-disable no-undef */
import { CompanyService } from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { useRef } from 'react';
import EditModal, { EditModalRef } from './component/EditModal';
import { CompanyType } from './type';
const Company: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<EditModalRef | null>(null);

  const onDelete = async (id: string) => {
    try {
      const res = await CompanyService.deleteCompany(id);
      if (res.success) {
        message.success('删除成功');
        actionRef.current?.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ProColumns<CompanyType>[] = [
    {
      title: '公司名称',
      align: 'center',
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: false,
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      width: 150,
      align: 'center',
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
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

  return (
    <PageContainer>
      <ProTable<CompanyType, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
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
              modalRef.current?.showModal({ name: '', remark: '', id: null });
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={CompanyService.getCompanyList<CompanyType>}
        columns={columns}
      />

      <EditModal ref={modalRef} actionRef={actionRef}></EditModal>
    </PageContainer>
  );
};

export default Company;
