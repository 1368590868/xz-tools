import zhCN from 'antd/es/calendar/locale/zh_CN';

const customLocale = {
  ...zhCN,
  lang: {
    ...zhCN.lang,
    weekFormat: '周',
    dayFormat: 'dddd',
    shortWeekDays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  },
};
export default customLocale;
