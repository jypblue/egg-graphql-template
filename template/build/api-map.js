const fs = require('fs');
const path = require('path');
const process = require('process');
const colors = require('colors');
const axios = require('axios');
const config = require('../config/api-map');
const srcPath = path.resolve(__dirname, '../src');
const signedDir = srcPath + '/assets/file';
// 环境数字变量
const env = process.argv[2] || config.env;
const apiUrl = `http://api-${env}.yit.com/apigw/info.api?json`; // 远程接口地址
// 需要拉取得接口名称
const apiSignMap = config.apiMap;

if (fs.existsSync(signedDir)) {
  console.log(`验签文件夹file已存在，无需重新生成文件;\n如需更新请手动执行 npm run map iX命令生成验签文件;\n iX为开发环境变量名称`.green);
} else {
  fs.mkdirSync(signedDir);
}

// -----------------------------------------
if (Object.keys(apiSignMap).length === 0) {
  console.log('传入的验签接口名称格式有误，请检查'.red);
}
console.log('Api Map start: '.green);
console.log(apiUrl);

axios.get(apiUrl).then(result => {
  const apiList = result.data.apiList;
  const apiNeedGroup = Object.keys(apiSignMap);
  console.log(apiNeedGroup);
  const apiNeedList = apiList.filter((item, i, arr) => {
    return apiNeedGroup.indexOf(item.groupName) > -1;
  });

  Object.keys(apiSignMap).forEach((key) => {
    const groupDir = signedDir + '/';
    // 创建文件夹
    // if(!fs.existsSync(groupDir)) {
    //   fs.mkdirSync(groupDir);
    // }


    let flag = true;
    apiNeedList.forEach((item, i) => {
      if (apiSignMap[key].length > 0) {
        flag = apiSignMap[key].indexOf(item.methodName.split('.')[1]) > -1;
      } else {
        flag = true;
      }

      // 组名相同
      if (item.groupName === key && flag) {
        const paramList = item.parameterInfoList;
        const params = {
          'roles': [],
          'security_type': '',
          'required': {},
          'optional': {
          }
        };
        params.security_type = item.securityLevel;
        if (!!paramList && Array.isArray(paramList)) {
          paramList.forEach((paramItem) => {
            if (paramItem.isRequired) {
              params.required[paramItem.name] = paramItem.type;
            }
          });
        }

        const newParams = JSON.stringify(params);
        const filePath = groupDir + item.methodName + '.js';
        console.log(`signed file path name: ${filePath}`.green);
        fs.writeFileSync(filePath,
          `window._APIMAP["${item.methodName}"] = ${newParams}`);
      }
    });

  });


}).catch(error => {
  console.log('获取验证签名数据失败\n'.red);
  console.log(`error: \n ${error}`);
});



// 设置控制台信息颜色
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'red',
  info: 'green',
  data: 'blue',
  help: 'cyan',
  warn: 'yellow',
  debug: 'magenta',
  error: 'red'
});

