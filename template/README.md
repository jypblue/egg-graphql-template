# A Vue Single Page Example for Boss Web Project

## 相关命令

``` bash
# 安装npm包
npm install / yarn

# 启动本地开发服务
npm run dev / yarn dev

# 拉取验签文件命令
npm run map iX / yarn map iX
```

## 目录结构：

```text
|-- build                 //webpack打包配置
|-- config                //webpack配置文件、验签文件配置
|-- deploy                // 发布配置
|-- dist                  // 打包生成目录
|-- src                   // 开发目录
    |-- assets             // 需要打包资源文件夹(svg,fonts,img,css ...)
    |-- components        // 公共组件目录
    |-- router            // 路由文件夹，如果路由配置比较多请单独抽出成独立文件
        |-- index.js      // 跟路由文件
        |-- suspect.js    // 子路由文件，demo例子，开发项目后请自行删除
    |-- store             // 全局状态文件夹 vuex
        |-- index.js      // vuex 根文件
        |-- modules       // 定义的全局 vuex 状态文件，目前有公共用到的一些文件
    |-- styles            // 全局样式文件夹，默认使用sass, 原则上一个页面一个样式文件，
    |-- utils             // 工具方法文件夹， 可自行新建类别一致的独立工具方法js文件
      |-- directive       // 全局自定义指令文件夹
      |-- filter          // 全局公用filter函数集合
      |-- mixin           // 全局公用mixin方法
      |-- ajax.js         // 封装ajax方法-主要用于文件上传使用
      |-- auth.js         // localStorage/cookie 方法封装
      |-- clipboard.js    // 复制粘贴功能方法文件
      |-- dom.js          // 常用dom操作方法集合
      |-- index.js        // 用与yit boss 系统相关的方法集合
      |-- tool.js         // 封装常用js方法
      |-- validate.js     // 全局公用验证函数集合
    |-- view              // 页面目录，简单规则是一个组一个文件夹，文件夹下新建页面.vue 页面，业务组件可以放入新建components的文件夹中
      |-- demo            // 例子文件，无实际意义，后续可以删除
      |-- error           // 401/404 页面
      |-- home            // 默认首页文件夹
      |-- layout          // 默认项目layout文件夹
      |-- login           // 默认登录文件夹
    |-- App.vue           // 入口vue文件
    |-- config.js         // 配置文件
    |-- http.js           // 公用请求配置包括基本ajax,上传upload,以及基本request请求
    |-- main.js           // 主入口
    |-- permission.js     // 权限管理文件
|-- static                // 非打包静态资源文件夹
|-- *                     // 后面的都是eslint/babel等打包配置文件
```

## 开发前需要注意的点

- 验签默认环境配的stage,自己拉取验签文件，请自行执行`npm run map iX`命令，验签的配置文件在`config/api-map.js`, []标识拉取该组下面所有接口, 自行添加接口名称表示只拉取添加的文件
- http.js 封装了axios的请求,有基本的post/get方法,然后再 mixin 全局方法中也有fnFetch方法提供请求,可以直接在Vue文件中通过`this.fnFetch()`调用进行请求。

``` js

// 单独请求：
const params = {
  mt: 'xxx.xxx', //接口名称
  data:{}, //参数
  _domPermissionStr: 'xxx', //权限字符串
  isLoading: true/false, //是否显示loading动画
}
// 合并请求：
const params = {
  mt: ['xxx.xxx','xxx.xxx'], //接口名称
  data:[{},{}], //参数
  _domPermissionStr: 'xxx,xxx', //权限字符串
  isLoading: true/false, //是否显示loading动画
}

```

- `src/config.js`为默认配置项,新建项目的时候目前还需要自己指定默认开发环境变量,如: `i5`,本地 localStorage 全局名称等
- 项目CDN配置项,请在`config/index.js`的 `build.assetsPublicPath`中进行配置
- 目前全局状态管理使用 vuex 管理,进行了可持续化处理,同步存储在本地localStorage下.<font color=#DC143C size=4>因此请在开发项目时不要滥用全局状态,localStorage只能存5M</font>
- route 配置请在router文件夹中配置,参考demo文件, 其中`meta 里面配置 icon=>menu 的 icon，permission=> 页面 menu 权限 id，title=>menu名称`,一个组请自行抽出一个文件进行管理

```js

// 路由对象：
{
    path: '/suspect',
    component: Layout,
    name: 'RiskSuspect',
    alwaysShow: true, //当子路由只有一个item时配置会展示父路由信息，不配置就默认显示子路由
    hidden:true, //是否展示menu信息，当某些三级页面不需要展示在menu上时进行配置
    meta: {
      title: '风险用户管理', //menu 名称
      icon: 'iconfont icon-fenlei', //menu图标
      permission: 'front-riskcontrol-75' //权限key
    },
    children: RiskSuspectChildRoutes
}

// 子路由：同上
const RiskSuspectChildRoutes =  [
  {
    path: 'list',
    name: 'RiskSuspectList',
    component: RiskSuspectList,
    meta: {
      title: '风控嫌疑人列表',
      icon: 'iconfont icon-fenlei',
      permission: 'front-riskcontrol-77',
    }
  },
  {
    path: 'blacklist',
    name: 'RiskSuspectBlacklist',
    component: RiskSuspectBlacklist,
    meta: {
      title: '风控黑名单列表',
      icon: 'iconfont icon-fenlei',
      permission: 'front-riskcontrol-78',
    }
  },
];
```

- 接口权限的配置，直接在封装的请求方法上添加`_domPermissionStr`的权限变量字符串

## 开发要求

1. 新建文件及文件夹必须以小写英文字母开头
2. 文件名称,要么-,要么驼峰,尽量语义化
3. 项目添加了eslint检查代码风格，eslint配置使用的是`AlloyTeam ESLint 规则`，请自行添加eslint插件
4. 个人推荐使用vscode开发，如果不习惯请忽视这条
5. ...

## 最后

1. 新项目的基本权限配置，请找架构组后端=》史欣欣
2. 新项目的配置可以直接找运维组will(毛广清)，或者找吉伟伟和我帮忙找运维配置
