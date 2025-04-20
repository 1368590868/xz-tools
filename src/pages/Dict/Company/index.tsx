/* eslint-disable no-undef */
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef } from 'react';
// import { TagsService } from '../TableList/service';
import { CompanyService } from '@/services';
import EditModal, { EditModalRef } from './component/EditModal';
import { CompanyType } from './type';
const Company: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<EditModalRef | null>(null);

  const deleteTag = async (id: string) => {
    try {
      const res = await TagsService.deleteTagById(id);
      if (res.code === 200) {
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
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: false,
    },
    {
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
        <Button type="link" key="delete" danger onClick={() => deleteTag(record.id)}>
          删除
        </Button>,
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
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              modalRef.current?.showModal({ name: '', remark: '' });
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
