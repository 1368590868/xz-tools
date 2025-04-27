import { TempEnterTheDetailsService } from '@/services';
import { downloadBlobFile } from '@/utils/download';
import { UploadOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { Button, Col, message, Row, Spin, Typography, Upload } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { MultipleRef } from '../type';

const { Text, Link } = Typography;

const MultipleForm: React.FC = React.forwardRef<MultipleRef>((props, ref) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [refId, setRefId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    total?: number;
    success?: number;
    fail?: number;
  }>({});

  const onOk = async () => {
    try {
      if (result.fail === 0) {
        setLoading(true);
        const res = await TempEnterTheDetailsService.save({ refId }).finally(() => {
          setLoading(false);
        });
        if (res.success) {
          message.success('批量上传成功');
        }
        return Promise.resolve();
      } else {
        if (fileList.length === 0) {
          message.warning('请上传文件');
        } else {
          message.warning('请下载失败详情表调整后重新上传');
        }
        return Promise.reject();
      }
    } catch (error) {
      return Promise.reject();
    }
  };
  useImperativeHandle(ref, () => ({
    onOk,
  }));

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    const res = await request('/api/tempEnterTheDetails/import', {
      method: 'POST',
      data: formData,
      requestType: 'form',
    }).finally(() => {
      setLoading(false);
    });

    setResult((prev) => {
      return {
        ...prev,
        total: res.data.total,
        success: res.data.success,
        fail: res.data.failed,
      };
    });
    // 👇 判断返回是否为有效 Blob（即上传成功）
    if (res.code === 0) {
      message.success(`${file.name} 上传成功`);

      // ✅ 更新 fileList 手动添加文件（并标记 status）
      setFileList(() => [
        {
          uid: file.uid,
          name: file.name,
          status: 'done',
          originFileObj: file,
        },
      ]);
      setRefId(res.data.refId);
    } else {
      message.error(`${file.name} 上传失败`);
    }
  };

  // 下载失败详情
  const handleDownloadFail = async () => {
    const res = await TempEnterTheDetailsService.export({ refId });
    downloadBlobFile(res.data, '失败详情.xlsx');
  };

  return (
    <Spin tip="加载中..." spinning={loading}>
      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <Text style={{ marginRight: 16 }}>请按模板上传交易明细表</Text>
          <Link href="/交易明细填写模板.xlsx" target="_blank">
            模板下载
          </Link>
        </div>
        <Row align="middle" style={{ marginBottom: 16 }}>
          <Col span={4}>
            <Text>
              <Text type="danger" style={{ marginRight: 4 }}>
                *
              </Text>
              交易明细表：
            </Text>
          </Col>
          <Col span={20}>
            <Upload
              beforeUpload={(file) => {
                handleUpload(file); // 👈 阻止默认上传，改为自己上传
                return false;
              }}
              fileList={fileList}
              onRemove={() => setFileList([])}
              accept=".xls,.xlsx"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Col>
        </Row>
        {fileList.length === 0 && (
          <Row>
            <Col span={4}></Col>
            {/* error tips */}
            <Col span={20}>
              <Text type="danger">请上传交易明细表</Text>
            </Col>
          </Row>
        )}

        {result.total !== undefined && (
          <div style={{ marginBottom: 16 }}>
            <Text>
              总条数{result.total}条，识别成功{result.success}条，
              <Text type={result.fail ? 'danger' : undefined}>识别失败{result.fail}条</Text>
              {result.fail === 0 ? '' : '，请下载失败详情表调整后重新上传。'}
            </Text>
            <div style={{ marginBottom: 16 }}></div>
            {result.fail !== 0 && (
              <Button type="primary" danger ghost onClick={handleDownloadFail}>
                下载失败详情
              </Button>
            )}
          </div>
        )}
        <div style={{ margin: 16, color: '#888' }}>
          提示：如果表格中有错误内容，为避免后续重复上传，整个表格内容都不会上传。
        </div>
      </div>
    </Spin>
  );
});

export default MultipleForm;
