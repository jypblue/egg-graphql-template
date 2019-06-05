const RiskSuspectList = () => import('@/view/demo');
const RiskSuspectBlacklist = () => import('@/view/demo/blacklist');

export default [
  {
    path: 'list',
    name: 'RiskSuspectList',
    component: RiskSuspectList,
    meta: {
      title: '风控嫌疑人列表',
      icon: 'fa fa-address-book-o',
      permission: 'front-riskcontrol-77',
    }
  },
  {
    path: 'blacklist',
    name: 'RiskSuspectBlacklist',
    component: RiskSuspectBlacklist,
    meta: {
      title: '风控黑名单列表',
      icon: 'fa fa-address-book',
      permission: 'front-riskcontrol-78',
    }
  },
];