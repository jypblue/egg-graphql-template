// 设定一个默认开发环境变量，新建项目时自己设定
// 如果运行命令中有带环境变量则取命令中的变量，没有就已默认变量为准
// const baseUrl =  window.abp ? window.abp.gatewayDomain : 'https://api-i9.yit.com';
const devEnv = '{{devEnv}}';
const baseUrl = window.abp ? '' : `https://api-${devEnv}.yit.com`;
const gitCommitTime = window.abp ? window.abp.gitCommitTime : '';
export default {
  gitCommitTime,
  baseUrl,
  devEnv,
  apiUrl: baseUrl + '/apigw/m.api',
  fileUrl: baseUrl + '/apigw/file.api',
  appKey: '{{appKey}}', // vuex本地localStorage存储名称,根据实际项目名称自行修改只要唯一就行
  appId: '{{appId}}', // 项目id
};