// @ts-ignore
/* eslint-disable */
import { CompanyType } from '@/pages/Dict/Company/type';
import { request } from '@umijs/max';

// 分页参数类型定义
export interface PageParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
}

// 分页响应类型定义
export interface PageResponse<T> {
  data: T[];
  total: number;
  success: boolean;
  pageSize: number;
  current: number;
}

// 公司服务类
export class CompanyService {
  // 查询公司列表（用于ProTable）
  static async getCompanyList<T>(params: PageParams): Promise<{
    data: T[];
    total: number;
    success: boolean;
  }> {
    try {
      const { current: pageNum, pageSize, ...rest } = params;
      const res = await request<{
        data: {
          list: T[];
          total: number;
        };
        code: number;
      }>('/api/corporationDict/listPage', {
        method: 'GET',
        params: {
          pageNum,
          pageSize,
          ...rest,
        },
      });

      return {
        data: res.data.list || [],
        total: res.data.total || 0,
        success: res.code === 0,
      };
    } catch (error) {
      console.error('获取公司列表出错:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }

  // 添加公司
  static async addCompany(data: Omit<CompanyType, 'id'>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request('/api/corporationDict/create', {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '添加成功',
      };
    } catch (error) {
      console.error('添加公司出错:', error);
      return {
        success: false,
        message: '添加失败',
      };
    }
  }

  // 更新公司
  static async updateCompany(data: Partial<CompanyType>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/corporationDict/modify`, {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '更新成功',
      };
    } catch (error) {
      console.error('更新公司出错:', error);
      return {
        success: false,
        message: '更新失败',
      };
    }
  }

  // 删除公司
  static async deleteCompany(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/corporationDict/deleteBatch`, {
        method: 'POST',
        data: [id],
      });
      return {
        success: res.code === 0,
        message: res.message || '删除成功',
      };
    } catch (error) {
      console.error('删除公司出错:', error);
      return {
        success: false,
        message: '删除失败',
      };
    }
  }
}
